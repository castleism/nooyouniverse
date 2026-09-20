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

    @Override
    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        webView.setWebViewClient(new WebViewClient());
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
    }
}
