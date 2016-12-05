package com.example.hsport.gardenapp;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.StrictMode;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;

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


public class ViewGardens extends AppCompatActivity {

    private String Jdata;
    private Button ToGraph;
    private EditText T0, Garden, Desc;
    private EditText T1;
    private EditText T2;
    private EditText Month;
    private EditText Year;
    private JSONArray Job;
    private String User;
    private String greetings;
    private ArrayList<String> gardens = new ArrayList();
    private View mActiveView;
    private View mProgressView;
    private GetDataTask DataTask = null;
    private ListView listView;
    private String selectedFromList = "Blank";
    private ArrayAdapter<String> adapter;
    private String password;
    private Button Add, Delete;



    private void parseJson(String data) throws JSONException
    {
        Job = new JSONArray(data);
        for(int i = 0; i < Job.length(); i++)
        {
            gardens.add(Job.getJSONObject(i).getString("gardenName").toString());
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

        private JSONArray data;
        private String check;
        private String Garden;

        GetDataTask(String g)
        {
            Garden = g;
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

                URL url = new URL("http://172.112.41.210:8110/php/GetSensors.php?user=" + User + "&garden=" + Garden);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(8000);
                InputStream in = new BufferedInputStream(conn.getInputStream());
                readStream(in);
                conn.disconnect();
                if(data.toString().equals("[]"))
                {
                    check = "No sensors have been added yet";
                    return false;
                }
                else
                {
                    check = "Fetching garden";
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
                Toast.makeText(getBaseContext(), "Fetching Sensors", Toast.LENGTH_LONG).show();
                Intent nIntent = new Intent(ViewGardens.this, ActiveDataActivity.class);
                nIntent.putExtra("Data", data.toString());
                nIntent.putExtra("Username", User);
                nIntent.putExtra("Password", password);
                nIntent.putExtra("Garden", Garden);
                ViewGardens.this.startActivity(nIntent);

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

    private void toHistory(String Gard)
    {
        if (DataTask != null)
        {
            return;
        }

            // Show a progress spinner, and kick off a background task to
            // perform the user login attempt.
            ShowProgress.showProgress(true, mActiveView, mProgressView);
            GetDataTask Task = new GetDataTask(Gard);
            Task.execute((Void) null);
    }

    private void Init()
    {
        adapter = new ArrayAdapter<String>(this, R.layout.textview, gardens);
        listView.setAdapter(adapter);
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> myAdapter, View myView, int myItemInt, long mylng) {
                selectedFromList = (String) (listView.getItemAtPosition(myItemInt));
                Toast.makeText(getBaseContext(), selectedFromList, Toast.LENGTH_LONG).show();

            }
        });
    }

    private void DeleteGarden() {
        if(!selectedFromList.equals("Blank")) {
            int SDK_INT = android.os.Build.VERSION.SDK_INT;
            if (SDK_INT > 8) {
                StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder()
                        .permitAll().build();
                StrictMode.setThreadPolicy(policy);
                try {
                    URL url = new URL("http://76.94.123.147:49180/deleteGarden.php?user=" + User + "&gardenName=" + selectedFromList + "&password=" + password);
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
            Toast.makeText(getBaseContext(), "Must select a garden to delete", Toast.LENGTH_LONG).show();

    }

    private void AddGarden()
    {
        int SDK_INT = android.os.Build.VERSION.SDK_INT;
        if (SDK_INT > 8) {
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder()
                    .permitAll().build();
            StrictMode.setThreadPolicy(policy);
            try {
                Garden = (EditText)findViewById(R.id.NewGarden);
                Desc = (EditText)findViewById(R.id.Description);
                URL url = new URL("http://76.94.123.147:49180/addGarden.php?user=" + User + "&gName=" + Garden.getText().toString() + "&password=" + password + "&gDesc=" + Desc.getText().toString());
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(8000);
                conn.getInputStream();
                conn.disconnect();
            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            adapter.add(Garden.getText().toString());
            adapter.notifyDataSetChanged();
            Toast.makeText(getBaseContext(), Garden.getText().toString() + " Added Successfully", Toast.LENGTH_LONG).show();

        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_gardens);
        Intent intent = getIntent();
        Add = (Button)findViewById(R.id.Add_Garden);
        Add.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public  void onClick(View view) {AddGarden();}
        });
        Delete = (Button)findViewById(R.id.Delete_Garden);
        Delete.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public  void onClick(View view) {DeleteGarden();}
        });
        mActiveView = findViewById(R.id.Active_form);
        mProgressView = findViewById(R.id.progressBar);
        Jdata = intent.getStringExtra("Data");
        User = intent.getStringExtra("Username");
        password = intent.getStringExtra("Password");
        T0 = (EditText)findViewById(R.id.Moisture);
        ToGraph = (Button)findViewById(R.id.ToGraph);
        ToGraph.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {toHistory(selectedFromList);}//change to history activity with month and username as parameters
        });
        listView = (ListView)findViewById(R.id.GardensList);
        try{ parseJson(Jdata);}
        catch (JSONException e){ e.printStackTrace();}
        Init();
        if(Job == null)
            greetings = "Create a garden to begin recording data";
        else {
            greetings = "\n Select a garden \n Then an action\n";
        }
        T0.setText("Hello: " +  intent.getStringExtra("Username") + greetings);

    }


}
