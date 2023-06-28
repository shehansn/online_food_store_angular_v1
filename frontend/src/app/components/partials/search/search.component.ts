import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchName = '';
  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.searchName) {
        this.searchName = params.searchName;
      }
    })

  }

  search(name: string): void {
    if (name) {
      this.router.navigateByUrl('/search/' + name)
    } else {
      this.router.navigateByUrl('')
    }
  }

}
