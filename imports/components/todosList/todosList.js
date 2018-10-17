import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Tasks } from '../../api/tasks.js';

import template from './todosList.html';
 
class TodosListCtrl {
  	constructor($scope) {
    	$scope.viewModel(this);

	    this.helpers({
	    	tasks() {
	    		const selector = {};

	    		//Filter tasks if hide completed checked
	    		if (this.getReactively('hideCompleted')){
	    			selector.checked = {
	    				$ne: true
	    			};
	    		}

	    		//Show newest taks at top
	    		return Tasks.find(selector, {
	    			sort: {
	    				createdAt: -1
	    			}
	    		});
	    	},
      		incompleteCount() {
        		return Tasks.find({
          			checked: {
            			$ne: true
          			}
        		}).count();
      		}
	    });
  	}

  	addTask(newTask) {
  		//insert task in to collection
  		Tasks.insert({
  			text: newTask,
  			createdAt: new Date
  		});

  		//clear form
  		this.newTask = '';
  	}

  	removeTask(task) {
  		Tasks.remove(task._id);
  	}

  	setChecked(task) {
  		Tasks.update(task._id, {
  			$set: {
  				checked: !task.checked
  			}
  		});
  	}
}
 
export default angular.module('todosList', [
  		angularMeteor
	])
  	.component('todosList', {
    	templateUrl: 'imports/components/todosList/todosList.html',
    	controller: ['$scope', TodosListCtrl]
  	});