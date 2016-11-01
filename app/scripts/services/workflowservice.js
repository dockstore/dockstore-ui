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

/**
 * @ngdoc service
 * @name dockstore.ui.WorkflowService
 * @description
 * # WorkflowService
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('WorkflowService', [
      '$q',
      '$http',
      'WebService',
      function ($q, $http, WebService) {

    this.getUserWorkflowList = function(userId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/users/' + userId + '/workflows'
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getPublishedWorkflowList = function() {
          return $q(function(resolve, reject) {
            $http({
              method: 'GET',
              url: WebService.API_URI + '/workflows/published'
            }).then(function(response) {
              resolve(response.data);
            }, function(response) {
              reject(response);
            });
          });
        };

    this.getPublishedWorkflowById = function(workflowId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/workflows/published/' + workflowId
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getPublishedWorkflowByPath = function(workflowPath) {
      var workflowPathEncoded = workflowPath.replace(/\//g, '%2F');
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/workflows/path/workflow/' + workflowPathEncoded +
                '/published/'
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.refreshWorkflow = function(workflowId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/workflows/' + workflowId + '/refresh',
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.restubWorkflow = function(workflowId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/workflows/' + workflowId + '/restub',
         }).then(function(response) {
          resolve(response.data);
         }, function(response) {
          reject(response);
         });
        });
       };

    this.refreshUserWorkflows = function(userId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/users/' + userId + '/workflows/refresh',
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.setWorkflowRegistration = function(workflowId, isPublished) {
      return $q(function(resolve, reject) {
        $http({
          method: 'POST',
          url: WebService.API_URI + '/workflows/' + workflowId + '/publish',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            publish: isPublished
          }
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getDescriptorFile = function(workflowId, tagName, type) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/workflows/' + workflowId + '/' + type,
          params: {
            tag: tagName
          }
        }).then(function(response) {
          resolve(response.data.content);
        }, function(response) {
          reject(response);
        });
      });
    };

    // this is actually a partial update, see https://github.com/ga4gh/dockstore/issues/274
    this.updateWorkflowDefaults = function(workflowId, workflowObj) {
      return $q(function(resolve, reject) {
        $http({
          method: 'PUT',
          url: WebService.API_URI + '/workflows/' + workflowId,
          data: {
            workflow_path: workflowObj.workflow_path,
            workflowName: workflowObj.workflowName,
            descriptorType: workflowObj.descriptorType,
            path: workflowObj.path,
            gitUrl: workflowObj.gitUrl,
            default_test_parameter_file: workflowObj.default_test_parameter_file
          }
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.updateWorkflowPathVersion = function(workflowId, workflowObj) {
      return $q(function(resolve, reject) {
        $http({
          method: 'PUT',
          url: WebService.API_URI + '/workflows/' + workflowId +'/resetVersionPaths',
          data: {
            workflow_path: workflowObj.workflow_path,
            workflowName: workflowObj.workflowName,
            descriptorType: workflowObj.descriptorType,
            path: workflowObj.path,
            gitUrl: workflowObj.gitUrl,
            default_test_parameter_file: workflowObj.default_test_parameter_file
          }
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getWorkflowDag = function(workflowId, workflowVersionId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/workflows/' + workflowId + '/dag/' + workflowVersionId
        }).then(function(response) {
          if (response !== null) {
            resolve(response.data);
          }
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getTestJson = function(workflowId, versionName) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/workflows/' + workflowId + '/testparameter',
          params: {
            version: versionName
          }
        }).then(function(response) {
          resolve(response.data.content);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.setWorkflowLabels = function(workflowId, labels) {
      return $q(function(resolve, reject) {
        $http({
          method: 'PUT',
          url: WebService.API_URI + '/workflows/' + workflowId + '/labels',
          params: {
            labels: labels
          }
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.createWorkflow = function(workflowRegistry, workflowPath, workflowDescriptorPath, workflowName, descriptorType, testParameterFilePath) {
      return $q(function(resolve, reject) {
        $http({
          method: 'POST',
          url: WebService.API_URI + '/workflows/manualRegister',
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            workflowRegistry : workflowRegistry,
            workflowPath : workflowPath,
            defaultWorkflowPath : workflowDescriptorPath,
            workflowName : workflowName,
            descriptorType : descriptorType,
            testParameterPath: testParameterFilePath
          }
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.updateWorkflowVersionTag = function(workflowId, tagObj) {
      return $q(function(resolve, reject) {
        $http({
          method: 'PUT',
          url: WebService.API_URI + '/workflows/' + workflowId + '/workflowVersions',
          headers: {
            'Content-Type': 'application/json'
          },
          data: [tagObj]
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };


    this.getDescriptorFilePath = function(containerId, tagName, type) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/workflows/' + containerId + '/' + type,
          params: {
            tag: tagName
          }
        }).then(function(response) {
          resolve(response.data.path);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getSecondaryDescriptorFile = function (containerId, tagName, type, secondaryDescriptorPath) {
      return $q(function (resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/workflows/' + containerId + '/' + type + '/' + secondaryDescriptorPath,
          params: {
            tag: tagName
          }
        }).then(function (response) {
          resolve(response.data.content);
        }, function (response) {
          reject(response);
        });
      });
    };

    this.getTableToolContent = function(workflowId, workflowVersionId){
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/workflows/' + workflowId + '/tools/' + workflowVersionId
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.updateDefaultVersion = function(workflowId,workflowObj){
      return $q(function(resolve, reject) {
        $http({
          method: 'PUT',
          url: WebService.API_URI + '/workflows/' + workflowId,
          data: workflowObj
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

  }]);
