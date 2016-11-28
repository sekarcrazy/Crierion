/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.scb.ae.bmw;

import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.res.AssetManager;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.provider.Settings;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.scb.ae.bmw.BMWWrapperPlugin;
import com.scb.ae.bmw.R;
import com.scb.ae.bmw.SecurityURLConnectionDelegate;

import org.apache.cordova.*;
import org.apache.cordova.engine.SystemWebViewClient;
import org.apache.cordova.engine.SystemWebViewEngine;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Context;
import java.io.*;
import java.util.Locale;
import java.util.regex.Pattern;
import android.webkit.*;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import android.webkit.SslErrorHandler;
import android.net.http.SslError;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Handler;
public class BMWWrapperAndroid extends CordovaActivity implements SecurityURLConnectionDelegate {
    private static String S_IS_WRAPPER = "isWrapper=true";
    private Handler handler;
    private String getAppVersion() {
        try {
            ComponentName comp = new ComponentName(this, this.getClass());
            PackageInfo pinfo = this.getPackageManager().getPackageInfo(comp.getPackageName(), 0);
            return pinfo.versionName;
        } catch (android.content.pm.PackageManager.NameNotFoundException e) {
            return "";
        }
    }

    private String getWrapperVersion() {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {
            InputStream inputStream = getResources().openRawResource(R.raw.wrapper_version);
            System.out.println(inputStream);

            int i;
            i = inputStream.read();
            while (i != -1) {
                byteArrayOutputStream.write(i);
                i = inputStream.read();
            }
            inputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return byteArrayOutputStream.toString();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Locale locale = Locale.getDefault(); // current locale
        handler = new Handler();
       if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
           getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
       }
        super.init();
        SystemWebViewEngine systemWebViewEngine = (SystemWebViewEngine) appView.getEngine();
        WebView webView = (WebView) systemWebViewEngine.getView();
		
        // handle opening external links
        WebViewClient scbWebViewClient = new SCBWebViewClient(systemWebViewEngine);
        webView.setWebViewClient(scbWebViewClient);
        
        
		//rootcheck
        if (RootUtil.isDeviceRooted()) {
            CommonUtil.showAlertRootedDevice(BMWWrapperAndroid.this);
        }
		

		
		// AVT SCB1408 L14 Testing Code
        webView.getSettings().setAppCacheEnabled(false);
        webView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);

        webView.getSettings().setBuiltInZoomControls(false);
        webView.getSettings().setUseWideViewPort(false);
        webView.getSettings().setGeolocationEnabled(true);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        webView.getSettings().setSavePassword(false);
        webView.getSettings().setSaveFormData(false);
        webView.clearFormData();
        setCookie(launchUrl, S_IS_WRAPPER);
        loadUrl(launchUrl);
    }

    private enum WebExtension {
        PNG, MP3, MP4, TTF, SVG, JS, ICO, HTML, CSS, EOT, WOFF, JSON;
    }

    class SCBWebViewClient extends SystemWebViewClient {
	
	    public SCBWebViewClient(SystemWebViewEngine parentEngine) {
            super(parentEngine);
        }
	    
	    public WebResourceResponse shouldInterceptRequest(WebView view, String url){
	    	String INJECTION_TOKEN ="***Inject****";
	    	WebResourceResponse response = null;
	    	if(url != null && url.contains("****")) {
	    	    String assetPath = url.substring(url.indexOf(INJECTION_TOKEN) + INJECTION_TOKEN.length(), url.length());
	    	    try {
	    	        String mimeType = "text/plain";

	    	        String ext = assetPath.substring(assetPath.lastIndexOf(".") + 1, assetPath.length());
	    	        WebExtension extension = WebExtension.valueOf(ext.toUpperCase());

	    	        switch(extension) {
	    	        case JS:
    	                mimeType = "application/javascript";
    	                break;
    	             default:
    	            	 mimeType = "text/html";
    	            	 break;
	    	        }
	    	        String str = parentEngine.getView().getContext().getAssets().toString();
	    	        response = new WebResourceResponse(
	    	            mimeType,
	    	            "UTF-8",
	    	            parentEngine.getView().getContext().getAssets().open(assetPath)
	    	        );
	    	        return response;
	    	    } catch (IOException e) {
	    	        e.printStackTrace(); // Failed to load asset file
	    	    }
	    	}
	    	return response;
	    }
	    
        public String strURL;
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
			Log.d(TAG,"shouldOverrideUrlLoading url:" + url.toString());
//        	if (url.contains("tcct")) {
//        		return true;
//        	}
            if (url.contains("facebook") || url.contains("twitter")) {

                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                startActivity(browserIntent);

                return true;
            }
            else if (isSsoLoginURL(url)) {
            	String ssCode = url.substring(url.indexOf("SSCode=")+7);
            	view.loadUrl(launchUrl+"#brz-ssoLogin?SSCode="+ssCode);
            	return true;
            }
            else if (isLoginURL(url)) {
            	view.loadUrl(launchUrl);
            	return true;
            }
            else if (isRetailURL(url) || isBsoiURL(url)) {
            	return false;
            }
            else if (isAllowURL(url))
            {
                this.strURL  = url;
                AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(BMWWrapperAndroid.this);
                // set title
                alertDialogBuilder.setTitle("Mobile banking");
                String popUPMessage = getResources().getString(R.string.POP_UP_MESSAGE);
                String strYes = getResources().getString(R.string.YES);
                String strNo = getResources().getString(R.string.NO);
                if(url.contains("legal_ibk_c")) {
                	popUPMessage = getResources().getString(R.string.POP_UP_MESSAGE_zh);
                    strYes = getResources().getString(R.string.YES_zh);
                    strNo = getResources().getString(R.string.NO_zh);
                }
                if(url.contains("ibank")) {
                	popUPMessage = getResources().getString(R.string.POP_UP_MESSAGE_SWITCH_TO_DESKTOP_VIEW);
                	if(url.contains("zh_HK")) {
                		popUPMessage = getResources().getString(R.string.POP_UP_MESSAGE_SWITCH_TO_DESKTOP_VIEW_zh);
                		strYes = getResources().getString(R.string.YES_zh);
                        strNo = getResources().getString(R.string.NO_zh);
                	}
                }
                // set dialog message
                alertDialogBuilder
                        .setMessage(popUPMessage)
                        .setCancelable(false)
                        .setPositiveButton(strYes,new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog,int id) {
                                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(strURL));
                                startActivity(browserIntent);
                            }
                        })
                        .setNegativeButton(strNo,new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog,int id) {
                                // if this button is clicked, just close
                                // the dialog box and do nothing
                                dialog.cancel();
                            }
                        });

                // create alert dialog
                AlertDialog alertDialog = alertDialogBuilder.create();
                // show it
                alertDialog.show();

                return true;
            }else if (url.contains("exit")){
            	onDestroy();
    			return true;
            }else if(url.contains("tel")){
            	Intent intent = new Intent(Intent.ACTION_DIAL);
            	intent.setData(Uri.parse(url));
            	startActivity(intent);
            	return true;
            }else if(url.contains("ral_tnc")){
            	this.strURL  = url;
            	AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(BMWWrapperAndroid.this);
                // set title
                alertDialogBuilder.setTitle("Mobile banking");
			    String _popUPMessage = getResources().getString(R.string.POP_UP_MESSAGE);
                String _strYes = getResources().getString(R.string.YES);
                String _strNo = getResources().getString(R.string.NO);
            	// set dialog message
                alertDialogBuilder
                        .setMessage(_popUPMessage)
                        .setCancelable(false)
                        .setPositiveButton(_strYes,new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog,int id) {
                                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(strURL));
                                startActivity(browserIntent);
                            }
                        })
                        .setNegativeButton(_strNo,new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog,int id) {
                                // if this button is clicked, just close
                                // the dialog box and do nothing
                                dialog.cancel();
                            }
                        });

                // create alert dialog
                AlertDialog alertDialog = alertDialogBuilder.create();
                // show it
                alertDialog.show();

                return true;
            }
            return false;
        }

        public void onPageFinished(WebView view, String url) {
			super.onPageFinished(view, url);
           // sendJavascript("setVersions('" + getWrapperVersion() + "', '" + getAppVersion() + "');");
            setCookie(url, S_IS_WRAPPER);

        }
		
		// REMOVE THIS IN PRODUCTION {
		
		public void onReceivedSslError (WebView view, SslErrorHandler handler, SslError error) {
			handler.proceed();
		}
		
		// } REMOVE THIS IN PRODUCTION

        private boolean isAllowURL(String url) {
            boolean flag = false;
            for (String urlItem : BMWWrapperPlugin.URLContainer) {
                if (url.contains(urlItem)) {
                    flag = true;
                    break;
                }
            }
            return flag;
        }
        
        private boolean isRetailURL(String url) {
            String regex = "^http(s)?:\\/\\/([\\w-]+\\.)+(sc.com|standardchartered.com).*(\\/retail\\/).*$";
            Pattern p = Pattern.compile(regex);
            if (p.matcher(url).find()) {
                return true;
            }
            return false;
        }
        
        private boolean isSsoLoginURL(String url) {
        	/*
            String regex = "^http(s)?:\\/\\/([\\w-]+\\.)+(sc.com|standardchartered.com|.139.123|.43.151).*(brz\\-ssoLogin)*.*$";
            Pattern p = Pattern.compile(regex);
            if (p.matcher(url).find()) {
                return true;
            }
            return false;*/
        	
        	if(url.contains("ssoLogin")){
        		return true;
        	}
        	return false;
        }
        
        private boolean isLoginURL(String url) {
            String regex = "^http(s)?:\\/\\/([\\w-]+\\.)+(sc.com|standardchartered.com|.139.123).*(brz\\-login)$";
            Pattern p = Pattern.compile(regex);
            if (p.matcher(url).find()) {
                return true;
            }
            return false;
        }
        
        private boolean isBsoiURL(String url) {
            String regex = "^http(s)?:\\/\\/([\\w-]+\\.)+(sc.com|standardchartered.com|.139.123).*(\\/bsoi).*$";
            Pattern p = Pattern.compile(regex);
            if (p.matcher(url).find()) {
                return true;
            }
            return false;
        }
    }
    

    public void onDestroy(){
    	super.onDestroy();
    }

    @Override
    public void onStart(){
    	super.onStart();
        setCookie(launchUrl, S_IS_WRAPPER);
        
        String _security_check_url = getResources().getString(R.string.SECURITY_CHECK_URL);
        String _security_check_fingerprint = getResources().getString(R.string.SECURITY_CHECK_FINGERPRINT);
        String _security_check_fingerprint_new = getResources().getString(R.string.SECURITY_CHECK_FINGERPRINT_NEW);
        String _security_check_fingerprint_new_1 = getResources().getString(R.string.SECURITY_CHECK_FINGERPRINT_NEW_1);

        SecurityChecker _securityChecker = new SecurityChecker(this);
        _securityChecker.execute(_security_check_url, _security_check_fingerprint, _security_check_fingerprint_new, _security_check_fingerprint_new_1,
                null);

    }
	private void showWebView() {
		 this.appView.loadUrl("javascript:try{BreezeUtils.deviceHelper.setMiniumheight();}catch(e){}");
		 //this.appView.setVisibility(WebView.VISIBLE);
	}

    
    private void setCookie(String url, String value){
        try{
            CookieSyncManager cookieSyncMngr = CookieSyncManager.createInstance(this);
            CookieManager cookieManager = CookieManager.getInstance();
            cookieManager.setAcceptCookie(true);
            cookieManager.setCookie(url, value);
        }catch(Exception e){}
    }

    public boolean isNetworkOnline() {
    	boolean status=false;
        try{
        	ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        	NetworkInfo netInfo = cm.getNetworkInfo(0);
            if (netInfo != null && netInfo.getState()==NetworkInfo.State.CONNECTED) {
                status= true;
            }else {
                netInfo = cm.getNetworkInfo(1);
                if(netInfo!=null && netInfo.getState()==NetworkInfo.State.CONNECTED)
                    status= true;
            }
        }catch(Exception e){
            return false;
        }
        return status;
    }

	public void secruityNetwork(){
		
	}

	public void dangerNetwork(){
		AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(BMWWrapperAndroid.this);
        // set title
        alertDialogBuilder.setTitle(getResources().getString(R.string.SECURITY_MESSAGE_TITLE));
        String popUPMessage = getResources().getString(R.string.SECURITY_MESSAGE);
        // set dialog message
        alertDialogBuilder
                .setMessage(popUPMessage)
                .setCancelable(false)
                .setPositiveButton(getResources().getString(R.string.YES),new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog,int id) {
                    	cordovaInterface.getActivity().finish();
                    	System.exit(0);
                    }
                });

        // create alert dialog
        AlertDialog alertDialog = alertDialogBuilder.create();
        // show it
        alertDialog.show();
	}

}

