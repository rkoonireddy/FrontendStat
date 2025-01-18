# STAT - Statistical Time Series Analysis Toolkit
**Your Toolkit for Analyzing Biomedical Time Series Data**

---

## Statistical Time Series Analysis Toolkit (STAT)

Welcome to **STAT**, Your all-in-one toolkit for analyzing and interpreting biomedical time-series data. Whether you're exploring cardiac rhythms, muscle activity, or other physiological signals, **STAT** empowers researchers, healthcare professionals, and engineers to uncover actionable insights and address complex challenges in biomedical signal analysis.
Biomedical signals hold the key to understanding the human body. 

#### Why Choose STAT?

While Python libraries like [**NeuroKit**](https://pypi.org/project/neurokit2/), [**BioSPPy**](https://biosppy.readthedocs.io/en/latest/index.html), and [**SciPy**](https://docs.scipy.org/doc/scipy/) offer robust tools for biomedical signal analysis, **STAT** takes it a step further:

- **Unified Visualization**: Seamlessly integrate capabilities from these libraries into a single, user-friendly visual interface.
- **No Technical Overhead**: Analyze signals without worrying about complex setups or deep programming expertise.
- **Streamlined Workflow**: Focus on insights and innovation, not on configuring tools.

With **STAT**, you get the power of the best libraries combined with a simple and intuitive visual platform tailored for biomedical signal analysis.


#### Key Features:
- 🎯 **Comprehensive Signal Support:** Analyze ECG, EMG, EEG, and more.
- 🚀 **User-Friendly Pipelines:** Quickly apply and test workflows.
- 📊 **Advanced Visualizations:** Generate plots and visual summaries.
- 🔧 **Customizable Workflows:** Save reusable workflows for ongoing projects.
- ✨ **Built-In Filters:** Apply denoising and preprocessing methods easily.


Ready to explore STAT? Check out [supported signals](#signals) to see how it can help with your specific needs.

---

## Table of Contents

Navigate through the various sections of the STAT Toolkit Documentation to learn more about the features and capabilities of our toolkit:

- [Challenges with Biomedical Signals](#supported-biomedical-signals)
- [Solutions for Signal Challenges](#how-stat-resolves-signal-challenges)
- [Available Pipelines](#available-pipelines)
- [How to Use STAT: Start Now](#how-to-use-stat)

---

## How to Use STAT
Getting started with the STAT toolkit is easy and can help you quickly begin analyzing biomedical time series data. Follow these simple steps to get started:

### Step 1: Prepare your data
Since STAT is an online tool hosted on the web, all you need is to come with clean data, preferably in CSV format. Make sure that your data doesn't contain any empty columns or rows or any non-numerical values. We check for these too.

### Step 2: Load Your Data
Once your data is ready, you can start by loading your biomedical signal data into the STAT environment. Currently we support only **CSV** data and many functions for **ECG**. In the future, we aim to support standard signal file types such as JSON, .edf for EEG, .mat for ECG, etc. You can easily import your data by following the instructions in the [user guide](#user-guide).

### Step 3: Select Your Signal Type (Optional)
Right now, we do not ask you for the signal type, we assume that your given file is ECG. Once you load the data. In the future, we support choosing the signal type to ensure that you see the right functions for the given signal type along with some general functions.

### Step 4: Apply Pipelines
We have 3 steps to apply pipelines:
  1. Create blocks such as "Notch Filter", "Butterworth" etc. and connect them.
  2. Choose the controls for these blocks, selct the features for which you want to apply the filters of the block.
  3. Run the pipleine using **play** icon.

### Step 5: Analyze Your Results
You will be offered 2 swichable tabs in the graph view called **Visualize** and **Compare**. Visualize showcases all the features (some may call these columns of the data) either overlapping each other or in a row view seperately (we call this Multivariate View) using a Multivariate view check box.

#### Step 5.1: Analyze Your Results - Visualize View 
In the **Visualize** view you will see all the features of the selected bloc. You can click on a different block other than the selected block to view the view for a different box. You have the opportunity to view magnified view of the graph here for the experts.

#### Step 5.2: Analyze Your Results - Compare View
In the **Compare** view you have the possibility to compare features and their transformations applied by different blocks at once. You can check / uncheck the features and change colors of the features by block. You are given an opportunity to compare the same features at different blocks or even different features at once.

### Step 6: View Pipeline History
You can check the entire history of what your pipeline has gone through. Each graph represents the order in which functional blocks are applied to signals (if they are no branching).

### Step 7: Save and Export Results
You can get replicate the results of the pipeline in 2 ways, exporting a **.py (python)** file or by giving your fellow researchers your **pipeline id** (eg. 1b06b9f4-f8f7-4d8c-b773-940ef41d6679). 

### Step 8: Delete Pipeline
We recommend you deleting the pipline at the end of your analysis unless you want the pipeline to be shared to someone. Since biomedical signals are considered to be personal information revealing, we strongly recommend anonymsing and deleting pipeline data.

---

## Supported Biomedical Signals

STAT supports the analysis of multiple biomedical signals, each critical in understanding and diagnosing physiological and neurological conditions. Learn more about each signal below.

### ECG (Electrocardiogram)
Measures the electrical activity of the heart, essential for diagnosing cardiac conditions such as arrhythmias and myocardial infarction. [Learn more about ECG](https://en.wikipedia.org/wiki/Electrocardiography).

**Common Challenges:**

![Common ECG Artifacts](help_stat/help_images/ECGTypicalArtifacts.png)

- Baseline wander due to patient movement or electrode drift.
- Powerline interference from external electrical equipment.
- Motion artifacts caused by physical activity or poor electrode contact.
- Muscle noise overlapping with the ECG signal.


## How STAT Resolves Signal Challenges

STAT provides robust tools and pipelines to mitigate common issues in biomedical signals, enhancing their quality for accurate analysis. Below are the challenges we tackle for each signal and how we address them, along with visual examples.

### ECG (Electrocardiogram)

Our toolkit effectively cleans ECG data and prepares it for diagnostic or research purposes.

**Solutions:**
- **Baseline Wander Removal:** High-pass filters to eliminate low-frequency drifts.  

- **Powerline Interference:** Notch / BandStop filters to suppress 50/60 Hz powerline noise.  

- **Motion Artifacts:** Adaptive filtering techniques to remove movement-induced distortions.  

- **Muscle Noise Suppression:** Wavelet denoising to separate ECG from EMG contamination.

## Available Pipelines

### ECG (Electrocardiogram) Pipelines

- **Baseline Wander Removal**
  - Step 1: Input ECG signal with baseline wander and powerline noise.
  - Step 2: Apply a high-pass filter to remove baseline wander.
  - Step 3: Apply a notch filter to remove powerline noise.
  - Step 4: Output clean ECG signal with minimal noise.

- **Motion Artifact Removal**
  - Step 1: Input ECG signal with motion artifacts.
  - Step 2: Use an adaptive filter to isolate and remove motion artifacts.
  - Step 3: Output the cleaned ECG signal with reduced motion artifacts.

- **Muscle Noise Suppression**
  - Step 1: Input ECG signal with muscle noise.
  - Step 2: Apply wavelet transform to separate muscle noise from the ECG signal.
  - Step 3: Use thresholding to suppress muscle noise components.
  - Step 4: Output the clean ECG signal.

---

## User Guide
This section helps users to understand the standard flow of STAT. The screenshot below shows the home of stat. You press the upload button or copy a pipeline id shared by one of your fellow researchers.

![Home](help_stat/help_images/home.png)

You will upload the CSV data as prescribed by us and enter the sampling frequency of the data. Since this is ECG data, we default this to 200 Hz, if you do not give any.

![UploadHome](help_stat/help_images/home_upload.PNG)

You will see a preview of data where you can select only the required features as shown here. This will let only the selected features to be selected for analysis. You press **UPLOAD**.

![SelectFeatures](help_stat/help_images/home_select_unselect_features.PNG)

### Analysis Home
Now we see the home page of the **Analysis** where we see the **Data Loader** view which shows a **table view** and **stat view** showcasing statistics of the data and violin plots respectively.

![Analysis TableView Home](help_stat/help_images/Product1_DataLoader_TableView1.PNG)

![Analysis StatView Home](help_stat/help_images/Product1_DataLoader_StatView1.PNG)


### Adding Function Blocks and Managing the Pipeline
The **canvas of the react-flow** lets you to add new blocks with the **+** icon you see on the canvas. We call the final output you create by adding the blocks a **pipeline**.

![Canvas](help_stat/help_images/Product1_Canvas.PNG)

 The canvas also offers options to adjust position and maginify the pipeline as you can see.

![Canvas Adjustment](help_stat/help_images/Product1_ReactFlow_Options.PNG)


To create a new block, you see all the existing function blocks when you click on the **+** icon. You can see what that function does and how the block can influence a signal.

![Add Block Full View](help_stat/help_images/Product1_AddBlock_allblocks.PNG)

You create a new block, connect these blocks together, and press the **run** icon.

![Plus](help_stat/help_images/Product1_AddBlock.PNG)

### Analysing Graphs
Now, we see what happens when you click run. You see the **Analyze** view which shows the graph including all the included signals and **The Controls** for the respective block. You can adjust these controls and re-run the pipeline.

![Analyse View 1](help_stat/help_images/Product1_Visualize1.PNG)

Another feature of the STAT is that you can create branches from the blocks to see how blocks transferred the same signal. For example, if you want to verify power line noise's presence when you are not aware - 50Hz or 60Hz, you will be able to easily verify visually.

![Analyse View 2](help_stat/help_images/Product1_Visualize2_Branch.PNG)
### Comparing Graphs
Compare view takes the analysis to a more intersting phase by enabling single screen analysis of all the block outputs at once while enabling users to select desired features, assignable colors to the features, and controlling the transparency of the lines.

Each block takes a color and all the features from that block will have same color but different patterns. Patterns are asigned in the order of selection.

![Compare View 1](help_stat/help_images/Product1_Compare1.PNG)

Here, you will see patters application of different featrues of the same block.
![Compare View 2](help_stat/help_images/Product1_Compare2_SameBlock1.PNG)

Here, you will see the comparison between same features of different blocks.
![Compare View 2](help_stat/help_images/Product1_Compare2_SameSignal1.PNG)

We also provide users the ability to select dynamic colors so that they are not restricted by set colors or any color pallette. We default a good color pallette too.
![Compare Color 1](help_stat/help_images/Product1_CompareView_selectColor.PNG)

### Pipeline History
Along with the visualise and comapare views you can check **the pipeline history** dropup which shows the graphs variation with each block in an order. When there is branching this can be slightly unclear, however, this provides a snapshot view of the features progress through the pipeline.

![Compare Color 1](help_stat/help_images/Product1_PipeLineHistroyView.PNG)

### Replication Options
We provide replication options both in offline and online forms. For more tech savvy users, we enable users to **download pipeline in a python file** format which can be used locally with a similar signal input.

For more research inclined users who would like to see the ouputs and changes in pipelines of other researchers, we enable **copy pipeline** which produces a unique id for your pipeline which can be shared. Others can just enter this pipeline id in the home screeen and see / continue you work with the signals.

[!Replication Options](help_stat/help_images/Product1_ExportOptions.PNG)

### Deleting Pipeline
Finally, clicking on the large **Recycle Bin** icon will delete your pipeline entirely, even from our database in the backend. We ensure that you are sure. 

Other recycle bins usually delete the block or connections between blocks in the canvas.

![Delete Pipeline](help_stat/help_images/Product1_DeletePipeLine.PNG)

![Delete Pipeline](help_stat/help_images/Product1_DeletePipeLinePopup.PNG)

---------------------------- *Happy      STATing !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!* ----------------------------
---

## Development Team
Pictures here

---

## How to reach us!!
You just cannot. Sorry!!

---

## Footer
&copy; 2024 STAT - Statistical Time Series Analysis Toolkit. All Rights Reserved.
