package com.nooyouniverse.observationlog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/**
 * Offline WebView host for the private observation log.
 * No network permission. No sensors. Not a store-release wrapper.
 */
public class MainActivity extends Activity {
    private static final int REQUEST_CREATE_EXPORT = 41;
    private static final int REQUEST_OPEN_IMPORT = 42;

    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;
    private String pendingExportText;
    private String debugCmd;
    private boolean debugRan;

    @Override
    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (BuildConfig.DEBUG && getIntent() != null) {
            debugCmd = getIntent().getStringExtra("noo_debug_cmd");
        }
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                runDebugCommand();
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(
                    WebView view,
                    ValueCallback<Uri[]> callback,
                    FileChooserParams params
            ) {
                if (fileCallback != null) {
                    fileCallback.onReceiveValue(null);
                }
                fileCallback = callback;
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/json");
                startActivityForResult(Intent.createChooser(intent, "Import observation JSON"), REQUEST_OPEN_IMPORT);
                return true;
            }
        });
        webView.addJavascriptInterface(new Bridge(), "NooBridge");
        webView.loadUrl("file:///android_asset/www/index.html");
        setContentView(webView);
    }

    private void runDebugCommand() {
        if (!BuildConfig.DEBUG || debugRan || debugCmd == null) return;
        debugRan = true;
        String js;
        if ("seed".equals(debugCmd)) {
            js = "(function(){try{"
                    + "var c=globalThis.NOO_APPROVED_MISSIONS,N=globalThis.NooLog,s=localStorage;"
                    + "N.writeAck(s);"
                    + "var store=N.createStore(c,N.localStorageAdapter(N.STORAGE_KEY,s));"
                    + "if(store.list().length===0){store.create({"
                    + "missionId:'mission-07',"
                    + "observedAt:new Date().toISOString(),"
                    + "variable:'Emulator process-death probe (not a measurement)',"
                    + "context:{sleepWindow:'',workload:'',environment:'emulator',timingNotes:'',stayedComparable:'Same AVD',other:''},"
                    + "expectation:'Should survive force-stop. Not a clinical claim.',"
                    + "outcome:'Nothing noticeable happened.',"
                    + "outcomeKind:'null',pattern:'first',uncertainty:'high',"
                    + "notes:'Debug probe only. Not shipped UI fixture data.'"
                    + "});}"
                    + "var rows=store.list();"
                    + "NooBridge.writeProbe(JSON.stringify({ok:true,phase:'seed',count:rows.length,id:rows[0]&&rows[0].id,kind:rows[0]&&rows[0].kind}));"
                    + "}catch(e){NooBridge.writeProbe(JSON.stringify({ok:false,phase:'seed',error:String(e)}));}})();";
        } else if ("dump".equals(debugCmd)) {
            js = "(function(){try{"
                    + "var c=globalThis.NOO_APPROVED_MISSIONS,N=globalThis.NooLog,s=localStorage;"
                    + "var store=N.createStore(c,N.localStorageAdapter(N.STORAGE_KEY,s));"
                    + "var exp=store.exportDocument();"
                    + "NooBridge.writeProbe(JSON.stringify({ok:!!exp.ok,phase:'dump',count:exp.value&&exp.value.count,format:exp.value&&exp.value.format,kind:exp.value&&exp.value.observations&&exp.value.observations[0]&&exp.value.observations[0].kind,variable:exp.value&&exp.value.observations&&exp.value.observations[0]&&exp.value.observations[0].variable}));"
                    + "}catch(e){NooBridge.writeProbe(JSON.stringify({ok:false,phase:'dump',error:String(e)}));}})();";
        } else {
            return;
        }
        webView.evaluateJavascript(js, null);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CREATE_EXPORT) {
            if (resultCode == RESULT_OK && data != null && data.getData() != null && pendingExportText != null) {
                try (OutputStream out = getContentResolver().openOutputStream(data.getData())) {
                    if (out != null) {
                        out.write(pendingExportText.getBytes(StandardCharsets.UTF_8));
                    }
                    toast("Export written. Keep it private.");
                } catch (Exception e) {
                    toast("Could not write export.");
                }
            }
            pendingExportText = null;
            return;
        }
        if (requestCode == REQUEST_OPEN_IMPORT) {
            Uri[] result = (resultCode == RESULT_OK && data != null && data.getData() != null)
                    ? new Uri[]{data.getData()}
                    : null;
            if (fileCallback != null) {
                fileCallback.onReceiveValue(result);
                fileCallback = null;
            }
        }
    }

    private void toast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    public class Bridge {
        @JavascriptInterface
        public void saveText(String filename, String text) {
            pendingExportText = text;
            Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("application/json");
            intent.putExtra(Intent.EXTRA_TITLE, filename != null ? filename : "noo-observation-log.json");
            startActivityForResult(intent, REQUEST_CREATE_EXPORT);
        }

        @JavascriptInterface
        public void writeProbe(String json) {
            if (!BuildConfig.DEBUG) return;
            try {
                File file = new File(getFilesDir(), "noo-probe.json");
                try (FileOutputStream out = new FileOutputStream(file)) {
                    out.write((json == null ? "{}" : json).getBytes(StandardCharsets.UTF_8));
                }
                File ext = getExternalFilesDir(null);
                if (ext != null) {
                    try (FileOutputStream out = new FileOutputStream(new File(ext, "noo-probe.json"))) {
                        out.write((json == null ? "{}" : json).getBytes(StandardCharsets.UTF_8));
                    }
                }
            } catch (Exception ignored) {
            }
        }
    }
}
