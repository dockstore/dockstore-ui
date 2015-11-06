# About Dockstore

The Dockstore concept is simple, provide a place where users can share tools
encapsulated in Docker and described with the [GA4GH](http://genomicsandhealth.org/)
[Common Workflow Language](http://common-workflow-language.github.io/) (CWL).
This enables scientists, for example, to share analytical tools in a way that makes them
machine readable and runnable in a variety of environments.

## Built with Quay.io and Github

Docker repositories, like
[DockerHub](https://hub.docker.com/) and [Quay.io](https://quay.io/), and
source control repositories like [GitHub](http://github.com) and
[BitBucket](https://bitbucket.org/), provide
much of the infrastructure we need.  They allow users build, publish,
and share both public and private Docker images.  However, the services lack a standardized ways of
describing how to invoke tools contained within the Docker containers.  The CWL
standard has defined a way to define the inputs, parameterizations, and outputs
of tools using a YAML-formated file.  Together, these resources provide the
necessary tools to share analytical tools in a highly portable way, a key
concern for the scientific community.

![Overview](dockstore_logos.png)

## Best Practices

First and foremost, the Dockstore has no requirements for what you register provided:

1) you can host the Docker image on Quay.io (and others in the future) which is linked to [GitHub](http://github.com) for automated building
1) you have a corresponding `Dockstore.yml` in CWL format that describes how to call the tools inside your Docker image

Over time, we find "skinny" Docker, those with single tools installed in them,
are more helpful for extending and building new workflows with.  That being said,
"fat" Docker containers, which include multiple tools and even full workflows
with frameworks like [SeqWare](http://seqware.io) or [Galaxy](https://galaxyproject.org/),
can have their place as well.  Projects like the ICGC
[PanCancer Analysis of Whole Genomes](https://dcc.icgc.org/pcawg) made use of "fat"
Docker containers that had complex workflows that fully encapsulated alignment and
variant calling.  The self-contained nature of these Docker containers allowed
for mobility between a wide variety of environments and greatly simplified
the setup of these pipelines across a wide variety of HPC and cloud environments.
Either approach works for the Dockstore so long as you can describe the tool
or workflow inside the Docker container as a CWL-defined tool (which you can
for most things).

## Promoting Standards



## Building a Community

## Future
