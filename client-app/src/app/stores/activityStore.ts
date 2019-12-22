import {
  observable,
  action,
  computed,
  configure,
  runInAction,
  decorate
} from 'mobx';
import { createContext } from 'react';
import IActivity from '../models/activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
  activityRegistry = new Map();
  activities: Array<IActivity> = [];
  selectedActivity: IActivity | undefined;
  loadingInitial = false;
  editMode = false;
  submitting = false;
  target = '';
  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => {
      return Date.parse(a.date) - Date.parse(b.date);
    });
  }
  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities in action', () => {
        activities.forEach((activity: IActivity) => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (error) {
      console.error(error.name + ': ' + error.message);
    } finally {
      runInAction('loaded activities in action', () => {
        this.loadingInitial = false;
      });
    }
  };
  /**
   * Creates and Updates activity
   * gets one activity from IActivity
   * @param activity
   */
  makeActivity = async (activity: IActivity, create: boolean = false) => {
    this.submitting = true;
    try {
      create
        ? await agent.Activities.create(activity)
        : await agent.Activities.update(activity);
      runInAction('setting activity in action', () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectActivity(activity.id);
      });
    } catch (error) {
      console.error(error.name + ': ' + error.message);
    } finally {
      runInAction('set activity in action', () => {
        this.editMode = false;
        this.submitting = false;
      });
    }
  };
  deleteActivity = async (
    event: React.SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction('deleting activity in action', () => {
        this.activityRegistry.delete(id);
        this.selectedActivity!.id === id && this.selectActivity(undefined);
        this.editMode = false;
      });
    } catch (error) {
      console.error(error.name + ': ' + error.message);
    } finally {
      runInAction('deleted activity in action', () => {
        this.target = '';
        this.submitting = false;
      });
    }
  };
  openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };
  closeForm = () => {
    this.editMode = false;
    this.selectedActivity = undefined;
  };
  setEditMode = (turnon: boolean) => {
    this.editMode = turnon;
  };
  selectActivity = (id: string | undefined) => {
    id === undefined
      ? (this.selectedActivity = undefined)
      : (this.selectedActivity = this.activityRegistry.get(id));
    this.editMode = false;
  };
}

decorate(ActivityStore, {
  activityRegistry: observable,
  activities: observable,
  selectedActivity: observable,
  loadingInitial: observable,
  editMode: observable,
  submitting: observable,
  target: observable,
  activitiesByDate: computed,
  loadActivities: action,
  makeActivity: action,
  deleteActivity: action,
  openCreateForm: action,
  closeForm: action,
  setEditMode: action,
  selectActivity: action
});

export default createContext(new ActivityStore());
