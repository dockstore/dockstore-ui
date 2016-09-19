/*
 *    Copyright 2016 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

'use strict';

describe('Service: WorkflowService', function () {

  // load the service's module
  beforeEach(module('dockstore.ui'));

  // instantiate service
  var WorkflowService, httpBackend;

  beforeEach(inject(function (_WorkflowService_, $httpBackend) {
    WorkflowService = _WorkflowService_;
    httpBackend = $httpBackend;
  }));

  describe('mocking services: GET', function() {
    // test taken from https://github.com/DockstoreTestUser/hello-dockstore-workflow/tree/testBoth

    it('should mock getDescriptorFile', function(){
      // mock getDescriptorFile
      httpBackend.whenGET("http://localhost:8080/workflows/1114/cwl?tag=testBoth").respond({
        "id": 1533,
        "type": "DOCKSTORE_CWL",
        "content": "#\n# This is a two-step workflow which uses \"revtool\" and \"sorttool\" defined above.\n#\nclass: Workflow\ndescription: \"A demonstration of a CWL workflow. This reverses the lines in a document and then sorts those lines.\"\ncwlVersion: cwl:draft-3\n\n# Requirements & hints specify prerequisites and extensions to the workflow.\n# In this example, DockerRequirement specifies a default Docker container\n# in which the command line tools will execute.\nhints:\n  - class: DockerRequirement\n    dockerPull: debian:8\n\n\n# The inputs array defines the structure of the input object that describes\n# the inputs to the workflow.\n#\n# The \"reverse_sort\" input parameter demonstrates the \"default\" field.  If the\n# field \"reverse_sort\" is not provided in the input object, the default value will\n# be used.\ninputs:\n  - id: input\n    type: File\n    description: \"The input file to be processed.\"\n  - id: reverse_sort\n    type: boolean\n    default: true\n    description: \"If true, reverse (decending) sort\"\n\n# The \"outputs\" array defines the structure of the output object that describes\n# the outputs of the workflow.\n#\n# Each output field must be connected to the output of one of the workflow\n# steps using the \"connect\" field.  Here, the parameter \"#output\" of the\n# workflow comes from the \"#sorted\" output of the \"sort\" step.\noutputs:\n  - id: output\n    type: File\n    source: \"#sorted/output\"\n    description: \"The output with the lines reversed and sorted.\"\n\n# The \"steps\" array lists the executable steps that make up the workflow.\n# The tool to execute each step is listed in the \"run\" field.\n#\n# In the first step, the \"inputs\" field of the step connects the upstream\n# parameter \"#input\" of the workflow to the input parameter of the tool\n# \"revtool.cwl#input\"\n#\n# In the second step, the \"inputs\" field of the step connects the output\n# parameter \"#reversed\" from the first step to the input parameter of the\n# tool \"sorttool.cwl#input\".\nsteps:\n  - id: rev\n    inputs:\n      - { id: input, source: \"#input\" }\n    outputs:\n      - { id: output }\n    run: revtool.cwl\n\n\n  - id: sorted\n    inputs:\n      - { id: input, source: \"#rev/output\" }\n      - { id: reverse, source: \"#reverse_sort\" }\n    outputs:\n      - { id: output }\n    run: sorttool.cwl\n",
        "path": "/Dockstore.cwl"
      });

      WorkflowService.getDescriptorFile(1114,'testBoth','cwl')
        .then(function(response){
          expect(response).toBe("#\n# This is a two-step workflow which uses \"revtool\" and \"sorttool\" defined above.\n#\nclass: Workflow\ndescription: \"A demonstration of a CWL workflow. This reverses the lines in a document and then sorts those lines.\"\ncwlVersion: cwl:draft-3\n\n# Requirements & hints specify prerequisites and extensions to the workflow.\n# In this example, DockerRequirement specifies a default Docker container\n# in which the command line tools will execute.\nhints:\n  - class: DockerRequirement\n    dockerPull: debian:8\n\n\n# The inputs array defines the structure of the input object that describes\n# the inputs to the workflow.\n#\n# The \"reverse_sort\" input parameter demonstrates the \"default\" field.  If the\n# field \"reverse_sort\" is not provided in the input object, the default value will\n# be used.\ninputs:\n  - id: input\n    type: File\n    description: \"The input file to be processed.\"\n  - id: reverse_sort\n    type: boolean\n    default: true\n    description: \"If true, reverse (decending) sort\"\n\n# The \"outputs\" array defines the structure of the output object that describes\n# the outputs of the workflow.\n#\n# Each output field must be connected to the output of one of the workflow\n# steps using the \"connect\" field.  Here, the parameter \"#output\" of the\n# workflow comes from the \"#sorted\" output of the \"sort\" step.\noutputs:\n  - id: output\n    type: File\n    source: \"#sorted/output\"\n    description: \"The output with the lines reversed and sorted.\"\n\n# The \"steps\" array lists the executable steps that make up the workflow.\n# The tool to execute each step is listed in the \"run\" field.\n#\n# In the first step, the \"inputs\" field of the step connects the upstream\n# parameter \"#input\" of the workflow to the input parameter of the tool\n# \"revtool.cwl#input\"\n#\n# In the second step, the \"inputs\" field of the step connects the output\n# parameter \"#reversed\" from the first step to the input parameter of the\n# tool \"sorttool.cwl#input\".\nsteps:\n  - id: rev\n    inputs:\n      - { id: input, source: \"#input\" }\n    outputs:\n      - { id: output }\n    run: revtool.cwl\n\n\n  - id: sorted\n    inputs:\n      - { id: input, source: \"#rev/output\" }\n      - { id: reverse, source: \"#reverse_sort\" }\n    outputs:\n      - { id: output }\n    run: sorttool.cwl\n");
        });
       httpBackend.flush();
    });

    it('should mock getWorkflowDAG', function(){
      // mock getWorkflowDAG
      httpBackend.whenGET("http://localhost:8080/workflows/1114/dag/1151").respond({
        "nodes": [
          {
            "data": {
              "name": "rev",
              "id": "0",
              "tool": "https://hub.docker.com/_/ubuntu"
            }
          },
          {
            "data": {
              "name": "sorted",
              "id": "1",
              "tool": "https://hub.docker.com/_/ubuntu"
            }
          }
        ],
        "edges": [
          {
            "data": {
              "source": "0",
              "target": "1"
            }
          }
        ]
      });

      WorkflowService.getWorkflowDag(1114,1151)
        .then(function(response){
          expect(response.nodes.length).toBe(2);
          expect(response.edges.length).toBe(1);
          expect(response.nodes[0].data.name).toBe('rev');
          expect(response.nodes[1].data.name).toBe('sorted');
          expect(response.edges[0].data.source).toBe('0');
          expect(response.edges[0].data.target).toBe('1');
        });
      httpBackend.flush();
    });

    it('should mock getTableToolContent', function() {
      // mock getTableToolContent
      httpBackend.whenGET("http://localhost:8080/workflows/1114/tools/1151").respond([
        {
          "id": "rev",
          "file": "revtool.cwl",
          "docker": "debian:8",
          "link": "https://hub.docker.com/_/debian"
        },
        {
          "id": "sorted",
          "file": "sorttool.cwl",
          "docker": "debian:8",
          "link": "https://hub.docker.com/_/debian"
        }
      ]);

      WorkflowService.getTableToolContent(1114, 1151)
        .then(function(response){
          expect(response.length).toBe(2);
          expect(response[0].id).toBe('rev');
          expect(response[1].id).toBe('sorted');
        });
      httpBackend.flush();
    });
  });

  describe('mocking services: PUT', function() {
    //mock setDefaultWorkflowPath
    it('should mock setDefaultWorkflowPath', function() {
      httpBackend.whenPUT("http://localhost:8080/workflows/1114").respond({
        //NOTE: this is just part of the real content. For complete full content, check the webservice
          "id": 1114,
          "author": null,
          "description": null,
          "labels": [],
          "gitUrl": "git@github.com:DockstoreTestUser/hello-dockstore-workflow.git",
          "mode": "FULL",
          "workflowName": null,
          "path": "DockstoreTestUser/hello-dockstore-workflow",
          "descriptorType": "cwl",
          "workflow_path": "/test/Dockstore.cwl"
      });

      WorkflowService.setDefaultWorkflowPath(1114,"/test/Dockstore.cwl",null,"cwl",
         "DockstoreTestUser/hello-dockstore-workflow","git@github.com:DockstoreTestUser/hello-dockstore-workflow.git")
        .then(function(response){
          expect(response.workflow_path).toBe('/test/Dockstore.cwl');
        });
      httpBackend.flush();
    });
  });

});
