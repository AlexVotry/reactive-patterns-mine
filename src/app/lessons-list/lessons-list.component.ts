import { Component, OnInit } from '@angular/core';
import { Observer, store } from '../event-bus-experiments/app-data';
import { Lesson } from '../shared/model/lesson';
import * as _ from 'lodash';

@Component({
  selector: 'lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrls: ['./lessons-list.component.css']
})
export class LessonsListComponent implements Observer, OnInit {

  lessons: Lesson[] = [];

  ngOnInit() {
    store.lessonsList$.subscribe(this);
  }

  next(data: Lesson[]) {
    console.log("Lessons list component received data : ", data);
    this.lessons = data.slice(0);
  }

  toggleLessonsViewed(lesson: Lesson) {
    console.log('toggling lesson');
    store.toggleLessonsViewed(lesson);
  }

  delete(deleted: Lesson) {
    store.deleteLesson(deleted);
  }

}
