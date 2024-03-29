import { ReadVarExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { Bet } from '../Bet'
import { BettingService } from '../betting.service';
import { GameDataService } from '../game-data.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public token: any;
  activeBets!: any;
  currentGames= new Array;
  constructor(private router: Router, private auth: AuthenticationService, private betService:BettingService,private service:GameDataService) { }

  ngOnInit(): void {

    this.token = this.auth.readToken();
    this.router.events.subscribe((event: Event) => {
      //if (event instanceof NavigationStart) { // only read the token on "NavigationStart"
      //  this.token = this.auth.readToken();
      //}
    });
    this.betService.getUserBetsInProgress(this.token.UserName).subscribe(data=>{
      this.activeBets = data;
      this.activeBets.forEach((element:any) => {
        this.service.getGameById(element.MatchId).subscribe(data=>{
          this.currentGames.push(data)
        })
      });
      
    })
  }

  public home(){
    this.router.navigate(['/home']);
  }
  public leaderboard(){
    this.router.navigate(['/leaderboard']);
  }
  public logout(){
    this.auth.logout();
    this.router.navigate(['/']);
  }
  selectImage(event: any){
  }

}
