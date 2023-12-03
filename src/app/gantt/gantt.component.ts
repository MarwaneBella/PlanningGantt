import { Component } from '@angular/core';
import { GanttService } from './gantt.service';
import { GanttEvent } from './GanttEvent';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

class GridEvent{
  id:number
  title:string
  startGrid:number
  endGrid:number
  color : string
}

class GridHeader{
  week:number
  year:number
}



@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
})
export class GanttComponent {

  colors: string[] = ['#FF5733', '#33FF57', '#5733FF', '#33B5FF', '#FF3373'];

  eventForm: FormGroup;

  dateGantt =  new Date();
  realDateGantt: Date = new Date();

  gridHeaders :GridHeader[] = []
  gridEvents :GridEvent[] = []

  events = this.ganttService.getEvents();
  newEvent: GanttEvent = new GanttEvent();
  breakPointYear:[boolean, number] = [false,0]
  datesValide : boolean = false

  constructor(private datePipe: DatePipe ,private ganttService: GanttService) {
    this.inializeFrom();
  }

  ngOnInit(): void {
    this.inializeGridHeaders()
  }

  inializeFrom(){
    this.eventForm = new FormGroup({
      title: new FormControl('', Validators.required),
      start: new FormControl('', Validators.required),
      end: new FormControl('', Validators.required),
    });
  }

  changeGantt(){
    this.realDateGantt = new Date(this.dateGantt)
    // console.log(this.realDateGantt)
    this.inializeGridHeaders()
    this.reloadEventsGantt()
  }

  inializeGridHeaders(){
    this.gridHeaders = []
    let nextWeek = this.realDateGantt
    let previousYear = nextWeek.getFullYear()
    this.breakPointYear = [false,0]
    for(var i=0; i<9 ;i++){

      var gridHeader : GridHeader = new GridHeader()

      gridHeader.week = this.getWeekOfyear(nextWeek)

      if(gridHeader.week == 1 && previousYear == nextWeek.getFullYear() ){
        // if(i != 0){
          gridHeader.year = nextWeek.getFullYear()+1
          // this.breakPointYear = [true,i+1]
          console.log("hello")

      }
      else{
        gridHeader.year = nextWeek.getFullYear()
        console.log("no hello")
      }

      // console.log(previousYear ,  nextWeek.getFullYear())

      if(gridHeader.week == 1 ){
        this.breakPointYear[1] = i+1
        console.log( "me "  + this.breakPointYear[1])
      }


      previousYear = nextWeek.getFullYear()

      this.gridHeaders.push(gridHeader);
      nextWeek.setDate(nextWeek.getDate()+ 7);
    }

    console.log(this.gridHeaders)

    console.log(this.gridHeaders[0].year, this.gridHeaders[ this.gridHeaders.length-1].year)

    if(this.gridHeaders[0].year != this.gridHeaders[ this.gridHeaders.length-1].year){
      this.breakPointYear[0] = true
    }
    if(this.gridHeaders[0].week == 1){
      this.breakPointYear[0] = false
    }



  }


  reloadEventsGantt(){
    console.log(this.gridHeaders)
    this.gridEvents = []
    this.events.forEach((event, i)=>{
      let gridEvent = new GridEvent()
      this.gridHeaders.forEach((element, j)=>{
        if( element.year == new Date(event.start).getFullYear() && element.week == this.getWeekOfyear( new Date(event.start)) ){
          gridEvent.startGrid  = j+1
          console.log("start : "+ element.week)
        }

        // console.log(event.end)

        // console.log( element.year +'== ' + new Date(event.end).getFullYear() , element.week + '==' + this.getWeekOfyear( new Date(event.end)))
        if( element.year == new Date(event.end).getFullYear() && element.week == this.getWeekOfyear( new Date(event.end)) ){
          gridEvent.endGrid  = j+2
          console.log("end : " +element.week)
        }
      })

      if(gridEvent.startGrid && !gridEvent.endGrid){
        gridEvent.endGrid = 10
      }
      else if(!gridEvent.startGrid && gridEvent.endGrid){
        gridEvent.startGrid = 1
      }
      console.log(gridEvent.startGrid,gridEvent.endGrid)
      if(gridEvent.startGrid && gridEvent.endGrid){
        gridEvent.id = event.id
        gridEvent.title = event.title
        gridEvent.color = this.randomColor()
        this.gridEvents.push(gridEvent)
      }

    })

    console.log(this.gridEvents)
  }

  addEvent(): void {
    // console.log(this.eventForm.controls['title'])
    // console.log(this.eventForm.controls['start'])
    // console.log(this.eventForm.controls['end'].value)
    if(this.compareDates(new Date(this.eventForm.controls['start'].value), new Date(this.eventForm.controls['end'].value))){
      const event = {
        id: this.events.length + 1,
        title: this.eventForm.controls['title'].value,
        start: new Date(this.eventForm.controls['start'].value),
        end: new Date(this.eventForm.controls['end'].value),
      };

      this.ganttService.addEvent(event);
      this.events = this.ganttService.getEvents();
      this.newEvent = new GanttEvent();
      this.reloadEventsGantt()
    }
    this.eventForm.reset()
  }

  removeEvent(eventId: number): void {
    this.ganttService.removeEvent(eventId);
    this.events = this.ganttService.getEvents();
    this.reloadEventsGantt()
  }


  getWeekOfyear(date : Date):number{
    var transWeek = this.datePipe.transform(date, 'w')
    return parseInt(transWeek!, 10)
  }


  compareDates(date1: Date, date2: Date):boolean{

    if(date1 <= date2){
      this.datesValide = true;
      return true;
    }
    else{
      this.datesValide = false;

      return false;
    }
  }

  randomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }



}
