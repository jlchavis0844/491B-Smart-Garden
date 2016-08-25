package com.example.hsport.gardenapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.HttpURLConnection;

/**
 * A login screen that offers login via email/password.
 */
public class LoginActivity extends AppCompatActivity
{

    private UserLoginTask mAuthTask = null;
    private UserRegisterTask mRegTask = null;

    // UI references.
    private AutoCompleteTextView mEmailView;
    private EditText mPasswordView;
    private View mProgressView;
    private View mLoginFormView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        // Set up the login form.
        mEmailView = (AutoCompleteTextView) findViewById(R.id.email);
        //populateAutoComplete();

        mPasswordView = (EditText) findViewById(R.id.password);
        mPasswordView.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView textView, int id, KeyEvent keyEvent) {
                if (id == R.id.login || id == EditorInfo.IME_NULL) {
                    attemptLogin();
                    return true;
                }
                return false;
            }
        });

        Button BtnReg = (Button) findViewById(R.id.RegisterBtn);
        BtnReg.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                attemptRegister();
            }
        });

        Button mEmailSignInButton = (Button) findViewById(R.id.email_sign_in_button);
        mEmailSignInButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                attemptLogin();
            }
        });

        mLoginFormView = findViewById(R.id.login_form);
        mProgressView = findViewById(R.id.login_progress);
    }

    private void attemptLogin()
    {
        if (mAuthTask != null)
        {
            return;
        }

        // Reset errors.
        mEmailView.setError(null);
        mPasswordView.setError(null);

        // Store values at the time of the login attempt.
        String email = mEmailView.getText().toString();
        String password = mPasswordView.getText().toString();

        boolean cancel = false;
        View focusView = null;

        // Check for a valid password, if the user entered one.
        if (TextUtils.isEmpty(password))
        {
            mPasswordView.setError("Please enter a password");
            focusView = mPasswordView;
            cancel = true;
        }

        // Check for a valid email address.
        if (TextUtils.isEmpty(email))
        {
            mEmailView.setError(getString(R.string.error_field_required));
            focusView = mEmailView;
            cancel = true;
        }
        if (cancel)
        {
            // There was an error; don't attempt login and focus the first
            // form field with an error.
            focusView.requestFocus();
        } else {
            // Show a progress spinner, and kick off a background task to
            // perform the user login attempt.
            ShowProgress.showProgress(true, mLoginFormView, mProgressView);
            mAuthTask = new UserLoginTask(email, password);
            mAuthTask.execute((Void) null);
        }
    }

    private void attemptRegister()
    {
        if (mRegTask != null)
        {
            return;
        }

        // Reset errors.
        mEmailView.setError(null);
        mPasswordView.setError(null);

        // Store values at the time of the login attempt.
        String email = mEmailView.getText().toString();
        String password = mPasswordView.getText().toString();

        boolean cancel = false;
        View focusView = null;

        // Check for a valid password, if the user entered one.
        if (TextUtils.isEmpty(password))
        {
            mPasswordView.setError("Please enter a password");
            focusView = mPasswordView;
            cancel = true;
        }

        // Check for a valid email address.
        if (TextUtils.isEmpty(email))
        {
            mEmailView.setError(getString(R.string.error_field_required));
            focusView = mEmailView;
            cancel = true;
        }
        if (cancel)
        {
            // There was an error; don't attempt login and focus the first
            // form field with an error.
            focusView.requestFocus();
        }
        else
        {
            // Show a progress spinner, and kick off a background task to
            // perform the user login attempt.
            ShowProgress.showProgress(true, mLoginFormView, mProgressView);
            mRegTask = new UserRegisterTask(email, password);
            mRegTask.execute((Void) null);
        }
    }

    public class UserLoginTask extends AsyncTask<Void, Void, Boolean>
    {

        private final String mEmail;
        private final String mPassword;
        private JSONArray data;
        private String check;

        UserLoginTask(String email, String password)
        {
            mEmail = email;
            mPassword = password;
            data = null;
        }

        public void readStream(InputStream is)
        {
            try
            {
                BufferedReader br = new BufferedReader(new InputStreamReader(is, "utf8"));
                StringBuilder sb = new StringBuilder();
                String line;

                while((line = br.readLine()) != null)
                    sb.append(line);
                data =  new JSONArray(sb.toString());

            } catch (JSONException | IOException e) {
                e.printStackTrace();
            }

        }
        public Boolean LoginCheck()
        {
            try
            {
                String username = mEmail;
                String pass = mPassword;
                URL url = new URL("http://172.112.41.210:8110/php/LoginUser.php?user=" + username + "&pass=" + pass);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(8000);
                InputStream in = new BufferedInputStream(conn.getInputStream());
                readStream(in);
                conn.disconnect();
                if(data.isNull(0))
                    return false;
                else
                {
                    check = "Logged in";
                    return true;
                }

            }
            catch (IOException e)
            {
                e.printStackTrace();
                return false;
            }

        }


        @Override
        protected Boolean doInBackground(Void... params)
        {
            return LoginCheck();
        }

        @Override
        protected void onPostExecute(final Boolean success)
        {
            mAuthTask = null;
            ShowProgress.showProgress(false, mLoginFormView, mProgressView);

            if (success)
            {
                Toast.makeText(getBaseContext(), check, Toast.LENGTH_LONG).show();
                Intent nIntent = new Intent(LoginActivity.this, ActiveDataActivity.class);
                nIntent.putExtra("Data", data.toString());
                LoginActivity.this.startActivity(nIntent);
            }
            else
            {
                mPasswordView.setError("Password/Username incorrect");
                mPasswordView.requestFocus();
            }
        }

        @Override
        protected void onCancelled()
        {
            mAuthTask = null;
            ShowProgress.showProgress(false, mLoginFormView, mProgressView);
        }
    }

    public class UserRegisterTask extends AsyncTask<Void, Void, Boolean>
    {

        private final String mEmail;
        private final String mPassword;
        private String data;

        UserRegisterTask(String email, String password)
        {
            mEmail = email;
            mPassword = password;
            data = "";
        }

        public String readStream(InputStream is)
        {
            try {
                BufferedReader br = new BufferedReader(new InputStreamReader(is, "utf8"));
                StringBuilder sb = new StringBuilder();
                String line;

                while((line = br.readLine()) != null)
                    sb.append(line);
                return sb.toString();

            } catch (IOException e) {
                return "shits weak";
            }
        }
        public void Register()
        {
            try
            {
                String username = mEmail;
                String pass = mPassword;
                URL url = new URL("http://172.112.41.210:8110/php/CreateLogin.php?use="+username+"&pass="+pass+"&MAC=TESTMAC");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                InputStream in = new BufferedInputStream(conn.getInputStream());
                data = readStream(in);
                if(data.equalsIgnoreCase("[]")) data = "Username already taken";
                else data = "Account Created, Sign in to Continue";

                conn.disconnect();
            }
            catch (IOException e)
            {
                e.printStackTrace();
            }

        }
        @Override
        protected Boolean doInBackground(Void... params)
        {
            Register();
            return true;
        }

        @Override
        protected void onPostExecute(final Boolean success)
        {
            mRegTask = null;
            ShowProgress.showProgress(false, mLoginFormView, mProgressView);
            Toast.makeText(getBaseContext(), data, Toast.LENGTH_LONG).show();
        }

        @Override
        protected void onCancelled()
        {
            mRegTask = null;
            ShowProgress.showProgress(false,mLoginFormView,mProgressView);
        }
    }

}

