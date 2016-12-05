package com.example.hsport.gardenapp;

import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.StrictMode;
import android.provider.ContactsContract;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;


public class ActiveDataActivity extends AppCompatActivity {
    private String Jdata;
    private Button ToGraph, Add, Delete;
    private EditText T0;
    private EditText T1;
    private EditText T2;
    private TextView moisture;
    private EditText Month;
    private EditText Year;
    private JSONArray Job;
    private String User;
    private View mActiveView;
    private View mProgressView;
    private GetDataTask DataTask = null;
    private ArrayList<String> sensors = new ArrayList();
    private ListView listSensors;
    private String selectedFromList = "Blank";
    private String user, password, garden;
    private ArrayAdapter<String> adapter;



    private void parseJson(String data) throws JSONException
    {
        Job = new JSONArray(data);
        for(int i = 0; i < Job.length(); i++)
        {
            sensors.add(Job.getJSONObject(i).getString("sensorName").toString());
        }
    }

    private String parseDate(String date) throws ParseException {
        DateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
        DateFormat outputFormat = new SimpleDateFormat("MMMM dd, yyyy");
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

        public Boolean GetData() throws JSONException {
            try
            {
                //http://76.94.123.147:49180/getGardenData.php?user=testUser&password=password1&gardenName=Garden1&startDate=2016-09-28&endDate=2016-10-02
                String startdate = Year +"-"+Month+"-01";
                String enddate = Year +"-"+Month+"-31";

                URL url = new URL("http://172.112.41.210:8110/php/newGetSensorData.php?user=" + user + "&password=" + password + "&gardenName=" + garden + "&startDate=" + startdate +"&endDate=" +enddate +"&sensor=" + selectedFromList);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(8000);
                InputStream in = new BufferedInputStream(conn.getInputStream());
                readStream(in);
                conn.disconnect();
                if(data.toString().equals("[]"))
                {
                    check = "No records exist in this month";
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
            try {
                return GetData();
            } catch (JSONException e) {
                e.printStackTrace();
            }
            return false;
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
                nIntent.putExtra("SensorName", selectedFromList);
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


    private void Init()
    {
        adapter = new ArrayAdapter<String>(this, R.layout.textview, sensors);
        listSensors.setAdapter(adapter);
        listSensors.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> myAdapter, View myView, int myItemInt, long mylng) {
                selectedFromList = (String) (listSensors.getItemAtPosition(myItemInt));
                Toast.makeText(getBaseContext(), selectedFromList, Toast.LENGTH_LONG).show();

            }
        });
    }
    private void DeleteSensor() {
        if(!selectedFromList.equals("Blank")) {
            int SDK_INT = android.os.Build.VERSION.SDK_INT;
            if (SDK_INT > 8) {
                StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder()
                        .permitAll().build();
                StrictMode.setThreadPolicy(policy);
                try {
                    URL url = new URL("http://76.94.123.147:49180/deleteSensor.php?user=" + user +  "&password=" + password + "&sensorName=" + selectedFromList );
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setConnectTimeout(8000);
                    conn.getInputStream();
                    conn.disconnect();
                } catch (MalformedURLException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }

            }


            Toast.makeText(getBaseContext(), selectedFromList + " Deleted from database", Toast.LENGTH_LONG).show();
            adapter.remove(selectedFromList);
            adapter.notifyDataSetChanged();
            selectedFromList = "Blank";
        }
        else
            Toast.makeText(getBaseContext(), "Must select a Sensor to delete", Toast.LENGTH_LONG).show();

    }
    private void AddSensor()
    {}
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
        moisture = (TextView)findViewById(R.id.Moisture);
        T0 = (EditText)findViewById(R.id.Moisture);
        T2 = (EditText)findViewById(R.id.HistoryDialog);
        T2.setText("Select a month and year to get a 31 day history graph.");
        listSensors = (ListView)findViewById(R.id.Sensor_item);
        Jdata = intent.getStringExtra("Data");
        user = intent.getStringExtra("Username");
        password = intent.getStringExtra("Password");
        garden = intent.getStringExtra("Garden");
        Delete = (Button)findViewById(R.id.Delete_Sensor);
        Delete.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public  void onClick(View view) {DeleteSensor();}
        });



        ToGraph = (Button)findViewById(R.id.ToGraph);
        ToGraph.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {toHistory();}//change to history activity with month and username as parameters
        });
        if(Jdata.equals("[]"))
            moisture.setText("Add a sensor to begin recording data");
        try{ parseJson(Jdata);}
        catch (JSONException e){ e.printStackTrace();}
        Init();

    }


}
