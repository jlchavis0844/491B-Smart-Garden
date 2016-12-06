package com.example.hsport.gardenapp;

import android.content.Intent;
import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;

import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.github.mikephil.charting.listener.ChartTouchListener;
import com.github.mikephil.charting.listener.OnChartGestureListener;
import com.github.mikephil.charting.listener.OnChartValueSelectedListener;

import org.json.JSONArray;
import org.json.JSONException;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class HistoryActivity extends AppCompatActivity implements OnChartGestureListener, OnChartValueSelectedListener {

    JSONArray jray;
    private LineChart mChart;
    private String fDate;
    private EditText text;
    private Button Redraw;
    private Boolean H;
    private String json;

    private String parseDate(String date) throws ParseException {
        DateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        DateFormat outputFormat;
        outputFormat = new SimpleDateFormat("dd");
        Date ndate = inputFormat.parse(date);
        return outputFormat.format(ndate);
    }

    public void graph(boolean H) throws JSONException, ParseException {
        mChart = (LineChart) findViewById(R.id.chart1);
        mChart.setOnChartGestureListener(this);
        mChart.setOnChartValueSelectedListener(this);
        mChart.setDrawGridBackground(false);

        // no description text
        mChart.setDescription("");
        mChart.setNoDataTextDescription("You need to provide data for the chart.");

        // enable touch gestures
        mChart.setTouchEnabled(true);

        // enable scaling and dragging
        mChart.setDragEnabled(true);
        mChart.setScaleEnabled(true);
        // mChart.setScaleXEnabled(true);
        // mChart.setScaleYEnabled(true);

        // if disabled, scaling can be done on x- and y-axis separately
        mChart.setPinchZoom(true);

        // set an alternative background color
        // mChart.setBackgroundColor(Color.GRAY);

        // x-axis limit line
        LimitLine llXAxis = new LimitLine(20, "Index 20");
        llXAxis.setLineWidth(4);
        llXAxis.enableDashedLine(10, 10, 0);
        llXAxis.setLabelPosition(LimitLine.LimitLabelPosition.RIGHT_BOTTOM);
        llXAxis.setTextSize(10);

        XAxis xAxis = mChart.getXAxis();
        xAxis.enableGridDashedLine(10, 10, 0);
        //xAxis.setValueFormatter(new MyCustomXAxisValueFormatter());
       // xAxis.addLimitLine(llXAxis); // add x-axis limit line

        LimitLine ll1 = new LimitLine(1000, "Upper Limit");
        ll1.setLineWidth(4);
        ll1.enableDashedLine(10, 10, 0);
        ll1.setLabelPosition(LimitLine.LimitLabelPosition.RIGHT_TOP);
        ll1.setTextSize(10);

        LimitLine ll2 = new LimitLine(0, "Lower Limit");
        ll2.setLineWidth(4);
        ll2.enableDashedLine(10, 10, 0);
        ll2.setLabelPosition(LimitLine.LimitLabelPosition.RIGHT_BOTTOM);
        ll2.setTextSize(10);

        xAxis.setAxisMaxValue(31);
        xAxis.setAxisMinValue(1);

        YAxis leftAxis = mChart.getAxisLeft();
        leftAxis.removeAllLimitLines(); // reset all limit lines to avoid overlapping lines
        leftAxis.addLimitLine(ll1);
        leftAxis.addLimitLine(ll2);
        if(H)
        leftAxis.setAxisMaxValue(100);
        else
        leftAxis.setAxisMaxValue(1000);
        leftAxis.setAxisMinValue(0);
        //leftAxis.setYOffset(20f);
        leftAxis.enableGridDashedLine(10, 10, 0);
        leftAxis.setDrawZeroLine(false);

        // limit lines are drawn behind data (and not on top)
        leftAxis.setDrawLimitLinesBehindData(true);

        mChart.getAxisRight().setEnabled(false);

        //mChart.getViewPortHandler().setMaximumScaleY(2f);
        //mChart.getViewPortHandler().setMaximumScaleX(2f);

        // add data
        setData(jray.length(), jray, H);

        mChart.setVisibleXRange(1,31);
//        mChart.setVisibleYRange(20f, AxisDependency.LEFT);
//        mChart.centerViewTo(20, 50, AxisDependency.LEFT);

        mChart.animateX(500);
        //mChart.invalidate();

        // get the legend (only possible after setting data)
        Legend l = mChart.getLegend();
        // modify the legend ...
        // l.setPosition(LegendPosition.LEFT_OF_CHART);
        l.setForm(Legend.LegendForm.LINE);
    }

    private void setData(int count, JSONArray array, boolean H) throws JSONException, ParseException {
        //moisture, humid, temp
        ArrayList<Entry> values = new ArrayList<>();
        ArrayList<Entry> values1 = new ArrayList<>();
        ArrayList<Entry> values2 = new ArrayList<>();

        int first = Integer.parseInt(fDate);
        int index;
        float val;
        String day;
        int date;
        //Toast.makeText(getBaseContext(), array.getJSONObject(0).getString("Moisture"), Toast.LENGTH_LONG).show();
        for (int i = first; i < first+count; i++)
        {
            //Moisture set
            index = i - first;
            if(!H) {
                val = Float.parseFloat(array.getJSONObject(index).getString("moisture"));
                date = Integer.parseInt(parseDate(jray.getJSONObject(index).getString("timeStamp")));
                values.add(new Entry(date, val));
                //Humidity set
            }
            else {
                val = Float.parseFloat(array.getJSONObject(index).getString("humidity"));
                date = Integer.parseInt(parseDate(jray.getJSONObject(index).getString("timeStamp")));
                values1.add(new Entry(date, val));
                //Temp set
                val = Float.parseFloat(array.getJSONObject(index).getString("temp"));
                values2.add(new Entry(date, val));
            }

        }

        LineDataSet set1;
        LineDataSet set2;
        LineDataSet set3;

            // create a dataset and give it a type
            set1 = new LineDataSet(values, "Moisture");
            set2 = new LineDataSet(values1, "Humidity");
            set3 = new LineDataSet(values2, "Temperature");

            // set the line to be drawn like this "- - - - - -"
            set1.enableDashedLine(10, 5, 0);
            set1.enableDashedHighlightLine(10, 5, 0);
            set1.setColor(Color.BLUE);
            set1.setCircleColor(Color.BLUE);
            set1.setLineWidth(1);
            set1.setCircleRadius(3);
            set1.setDrawCircleHole(false);
            set1.setValueTextSize(9);
            set1.setDrawFilled(false);
            set1.setLineWidth(1);
            set1.setFillColor(Color.BLUE);
            // set the line to be drawn like this "- - - - - -"
            set2.enableDashedLine(10, 5, 0);
            set2.enableDashedHighlightLine(10, 5, 0);
            set2.setColor(Color.RED);
            set2.setCircleColor(Color.RED);
            set2.setLineWidth(1);
            set2.setCircleRadius(3);
            set2.setDrawCircleHole(false);
            set2.setValueTextSize(9);
            set2.setDrawFilled(false);
            set2.setLineWidth(1);
            set2.setFillColor(Color.RED);
            // set the line to be drawn like this "- - - - - -"
            set3.enableDashedLine(10, 5, 0);
            set3.enableDashedHighlightLine(10, 5, 0);
            set3.setColor(Color.YELLOW);
            set3.setCircleColor(Color.YELLOW);
            set3.setLineWidth(1);
            set3.setCircleRadius(3);
            set3.setDrawCircleHole(false);
            set3.setValueTextSize(9);
            set3.setDrawFilled(false);
            set3.setLineWidth(1);
            set3.setFillColor(Color.YELLOW);


            ArrayList<ILineDataSet> dataSets = new ArrayList<>();
            if(!H)
            dataSets.add(set1); // add the datasets
            else {
                dataSets.add(set2); // add the datasets
                dataSets.add(set3); // add the datasets
            }


            // create a data object with the datasets
            LineData data = new LineData(dataSets);

            // set data
            mChart.setData(data);
    }

    public void parseJson(String data) throws JSONException {
        jray = new JSONArray(data);
        if(jray.getJSONObject(0).getString("temp").toString().equals("null"))
            H = false;
        else
            H = true;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history);
        Intent intent = getIntent();
        json = intent.getStringExtra("Data");
        Redraw = (Button) findViewById(R.id.GDraw);
        mChart = (LineChart) findViewById(R.id.chart1);
        text = (EditText) findViewById(R.id.editText);
        text.setText(intent.getStringExtra("SensorName") + ": readings");

        try {
            parseJson(json);
            fDate = parseDate(jray.getJSONObject(0).getString("timeStamp"));
            graph(H);
        } catch (JSONException | ParseException e) {
            e.printStackTrace();
        }

        Redraw.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) { try {
                parseJson(json);
                fDate = parseDate(jray.getJSONObject(0).getString("timeStamp"));
                graph(H);
            } catch (JSONException e) {
                e.printStackTrace();
            } catch (ParseException e) {
                e.printStackTrace();
            }
            }
        });
    }

    @Override
    public void onChartGestureStart(MotionEvent me, ChartTouchListener.ChartGesture lastPerformedGesture) {

    }

    @Override
    public void onChartGestureEnd(MotionEvent me, ChartTouchListener.ChartGesture lastPerformedGesture) {

    }

    @Override
    public void onChartLongPressed(MotionEvent me) {

    }

    @Override
    public void onChartDoubleTapped(MotionEvent me) {

    }

    @Override
    public void onChartSingleTapped(MotionEvent me) {

    }

    @Override
    public void onChartFling(MotionEvent me1, MotionEvent me2, float velocityX, float velocityY) {

    }

    @Override
    public void onChartScale(MotionEvent me, float scaleX, float scaleY) {

    }

    @Override
    public void onChartTranslate(MotionEvent me, float dX, float dY) {

    }

    @Override
    public void onValueSelected(Entry e, Highlight h) {

    }

    @Override
    public void onNothingSelected() {

    }
}
//