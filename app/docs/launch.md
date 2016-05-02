# Launching Tools and Workflows

This tutorial walks through some of our utilities for quickly launching tools and workflows in a naive way.
We also provide a glimpse at launching them in environments that are more scalable such as cloud-based platforms. 

## Run Tools

Now that you have a tool registered on Dockstore you may want to call it yourself for your own work. We created the [Launcher](https://github.com/CancerCollaboratory/dockstore-descriptor#dockstore-descriptor) to aid in this process.  In the near future this will be rolled into the `dockstore` command line but for now you can use the Launcher to do several useful things:

0. read a JSON file that describes all the inputs and outputs for a given run of the tool
0. automatically copy inputs from remote URLs if HTTP, FTP, S3 or other remote URLs are specified
0. call the `cwltool` command line to execute your tool using the CWL from the Dockstore and the JSON for inputs/outputs
0. if outputs are specified as remote URLs, copy the results to these locations

Alternatively, you have the option of simply working with any tools that understand CWL. The `dockstore` command line has a simple way to download the CWL file for use with other tools.
