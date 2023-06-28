import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { Tag } from 'src/app/shared/models/Tag';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  tags?: Tag[] = [];

  constructor(private foodService: FoodService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.tags = this.foodService.getAllTags();

  }

}
