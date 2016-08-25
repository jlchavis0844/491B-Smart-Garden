package com.example.hsport.gardenapp;

import android.content.Intent;
import android.os.AsyncTask;
import android.provider.ContactsContract;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;


public class ActiveDataActivity extends AppCompatActivity {
    private String Jdata;
    private Button ToGraph;
    private EditText T0;
    private EditText T1;
    private EditText T2;
    private EditText Month;
    private EditText Year;
    private JSONObject Job;
    private View mActiveView;
    private View mProgressView;
    private GetDataTask DataTask = null;



    private void parseJson(String data) throws JSONException
    {
        JSONArray Pdata = new JSONArray(data);
        Job = new JSONObject(Pdata.getString(0));
    }

    private String parseDate(String date) throws ParseException {
        DateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
        DateFormat outputFormat = new SimpleDateFormat("MMM dd, yyyy");
        Date ndate = inputFormat.parse(date);
        return outputFormat.format(ndate);
    }

    public class GetDataTask extends AsyncTask<Void, Void, Boolean>
    {

        private final String Month;
        private final String Year;
        private JSONArray data;
        private String check;

        GetDataTask(String month, String year)
        {
            Month = month;
            Year = year;
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

        public Boolean GetData()
        {
            try
            {

                URL url = new URL("http://172.112.41.210:8110/php/GetAllData.php?month=" + Month + "&year=" + Year);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(8000);
                InputStream in = new BufferedInputStream(conn.getInputStream());
                readStream(in);
                conn.disconnect();
                if(data.isNull(0))
                {
                    check = "No records between those dates";
                    return false;
                }
                else
                {
                    check = "History Fetched";
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
            return GetData();
        }

        @Override
        protected void onPostExecute(final Boolean success)
        {
            DataTask = null;
            ShowProgress.showProgress(false, mActiveView, mProgressView);

            if (success)
            {
                Toast.makeText(getBaseContext(), check, Toast.LENGTH_LONG).show();
                Intent nIntent = new Intent(ActiveDataActivity.this, HistoryActivity.class);
                nIntent.putExtra("Data", data.toString());
                ActiveDataActivity.this.startActivity(nIntent);
            }
            else
            {
                Toast.makeText(getBaseContext(), check, Toast.LENGTH_LONG).show();
            }
        }

        @Override
        protected void onCancelled()
        {
            DataTask = null;
            ShowProgress.showProgress(false, mActiveView, mProgressView);
        }
    }

    private void toHistory()
    {
        if (DataTask != null)
        {
            return;
        }

        // Reset errors.
        Month.setError(null);
        Year.setError(null);

        // Store values at the time of the login attempt.
        String mMonth = Month.getText().toString();
        String mYear = Year.getText().toString();

        boolean cancel = false;
        View focusView = null;
        int parse;
        String er = "Please enter a month from 1-12";
        try{
            parse = Integer.parseInt(mMonth);
        }
        catch(NumberFormatException e)
        {
            parse = 0;
            er = "Must input a number";
            e.printStackTrace();
        }
        // Check for a valid password, if the user entered one.
        if (TextUtils.isEmpty(mMonth) || parse < 1 || parse > 12)
        {
            Month.setError(er);
            focusView = Month;
            cancel = true;
        }

        // Check for a valid email address.
        if (TextUtils.isEmpty(mYear))
        {
            Year.setError(getString(R.string.error_field_required));
            focusView = Year;
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
            ShowProgress.showProgress(true, mActiveView, mProgressView);
            GetDataTask Task = new GetDataTask(mMonth, mYear);
            Task.execute((Void) null);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_active_data);
        Intent intent = getIntent();

        Month = (EditText) findViewById(R.id.Month_form);
        Year = (EditText)findViewById(R.id.Year_form);
        mActiveView = findViewById(R.id.Active_form);
        mProgressView = findViewById(R.id.progressBar);
        T1 = (EditText)findViewById(R.id.CurrentReading);
        T0 = (EditText)findViewById(R.id.Moisture);
        T2 = (EditText)findViewById(R.id.HistoryDialog);
        T2.setText("Select a month and year to get a 30 day history graph.");

        Jdata = intent.getStringExtra("Data");

        ToGraph = (Button)findViewById(R.id.ToGraph);
        ToGraph.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {toHistory();}//change to history activity with month and username as parameters
        });
        try{ parseJson(Jdata);}
        catch (JSONException e){ e.printStackTrace();}

        try {
            String message = parseDate(Job.getString("Gdate")) + "\n" + "Moisture Level : " + Job.getString("Moisture");
            String water;
            int moist = Integer.parseInt(Job.getString("Moisture"));
            if(moist <= 300)
                water = "It was pretty dry that day, make sure your reservoir has water!";
            else if(moist > 300 && moist < 750)
                water = "All is well, your plants feel amazingggg!";
            else
                water = "It must have rained!";
            T1.setText(message + "\n" + water);
            T0.setText("Hello, " + Job.getString("UserName") + "! Welcome to your Smart Garden!");
        }
        catch (JSONException | ParseException e) { e.printStackTrace();
        }
    }


}
