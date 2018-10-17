import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
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
      		},
      		currentUser() {
      			return Meteor.user();
      		}
	    });
  	}

  	addTask(newTask) {
  		//insert task in to collection
  		Meteor.call('tasks.insert', newTask);

  		//clear form
  		this.newTask = '';
  	}

  	removeTask(task) {
  		Meteor.call('tasks.remove', task._id);
  	}

  	setChecked(task) {
  		// Set the checked property to the opposite of its current value
    	Meteor.call('tasks.setChecked', task._id, !task.checked);
  	}
}
 
export default angular.module('todosList', [
  		angularMeteor
	])
  	.component('todosList', {
    	templateUrl: 'imports/components/todosList/todosList.html',
    	controller: ['$scope', TodosListCtrl]
  	});