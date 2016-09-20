# Advanced Features

## Input File Cache

When developing or debugging tools, it can be time consuming (and space-consuming) to repeatedly download input files for your tools. A feature of the Dockstore CLI is the ability to cache input files locally so that they can be quickly re-used for multiple attempts at launching a tool. 

This feature relies upon Linux [hard-linking](https://en.wikipedia.org/wiki/Hard_link) so when enabling this feature, it is important to ensure that the location of the cache directory (by default, at `~/.dockstore/cache/`) is on the same filesystem as the working directory where you intend on running your tools. 

There are two configuration file keys that can be used to activate input file caching and to configure the location of the cache.  These are added (or changed) inside your configuration file at `~/.dockstore/config`.

```
use-cache = true 
cache-dir = 
```

The former is false by default and can be set to true in order to activate the cache. 
The latter is `~/.dockstore/cache/` by default and can be set to any directory location.

## Running CWL-runner with extra tags

When running a CWL tool, you may want to add additional parameters/flags to the cwl-runner command. You can do this by updating your dockstore config file (~/.dockstore/config).

As an example, adding the following line to your config file will stop cwl-runner from cleaning up, make it run in debug mode, and set the outdir to '/new/outputdir'

```
cwltool-extra-parameters: --debug, --leave-container, --leave-tmpdir, --outdir /new/outputdir
```
