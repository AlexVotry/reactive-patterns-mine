import * as _ from 'lodash';
import { Lesson } from '../shared/model/lesson';

export interface Observer {
  next(data:any);
}

export interface Observable {
  subscribe(obs:Observer);
  unsubscribe(obs:Observer);
}

interface Subject extends Observer, Observable{

}

class SubjectImplentation implements Subject {

  private observers: Observer[] = [];

  next(data: any) {
    this.observers.forEach(obs => obs.next(data));
  }

  subscribe(obs: Observer) {
    this.observers.push(obs);
  }

  unsubscribe(obs: Observer) {
    _.remove(this.observers, el => el === obs);
  }
}

class DataStore {
  // lessons is private to this file.
  private lessons: Lesson[] = [];
  private lessonsListSubject = new SubjectImplentation();

  public lessonsList$: Observable = {
    subscribe: obs => {
      this.lessonsListSubject.subscribe(obs);
      obs.next(this.lessons);
    },
    unsubscribe: obs => this.lessonsListSubject.unsubscribe(obs)
  };

  // we can use this function to get a clone of the lessons.
  initializeLessonsList(newList: Lesson[]) {
    this.lessons = _.cloneDeep(newList);
    this.broadcast();
  }

  addLesson(newLesson: Lesson) {
    this.lessons.push(_.cloneDeep(newLesson));
    this.broadcast();
  }

  deleteLesson(deleted: Lesson) {
    _.remove(this.lessons, lesson => lesson.id == deleted.id);
    this.broadcast();
  }

  toggleLessonsViewed(toggled: Lesson) {
    const lesson = _.find(this.lessons, lesson => lesson.id === toggled.id);

    lesson.completed = !lesson.completed;
    this.broadcast();
  }

  broadcast() {
    this.lessonsListSubject.next(_.cloneDeep(this.lessons));
  }

}

export const store = new DataStore();
