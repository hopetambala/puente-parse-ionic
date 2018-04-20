import { Component } from '@angular/core';
import { App } from 'ionic-angular';

// Providers
import { ParseProvider } from '../../providers/parse/parse';
import { AuthProvider } from '../../providers/auth/auth';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

// Pages
import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

// Declare Variables
export class HomePage {
  //Enables Options from Geolocation Import
  options: GeolocationOptions;
  
  //Variables in Survey
  newSurveyOld =
  {
    fname: null,
    lname: null,
    dob: null,
    sex: null,
    marriageStatus: null,
    occupation: null,
    publicPrivateInsurance: null,
    memberProgresando: null,
    memberOfAssociation: null,
    nameOfAssociation: null,
    familyHistoryDiabetes: null,
    familyHIstoryCardiacDisease: null,
    familyHistoryofAlcoholism: null,
    familyHistoryofBreastCancer: null,
    familyHistoryofProstateCancer: null,
    familyHistoryofMentalDisease: null,
    diabetesDiagnosis: null,
    respiratoryproblems: null,
    cardiacproblems: null,
    numberofAlchoholDrinks: null,
    sexualHealth_Diseasesaproblem: null,
    sexualHealth_Teenagepregnancyaproblem: null,
    waterAccess: null,
    waterQuality: null,
    waterAccessfrequency: null,
    clinicAccess: null,
    latrineAccess: null,
    trashDisposalLocation: null,
    numberofpeoplelivingintheHouse: null,
    childrenUnder5LivinginHouse: null,
    conditionofHouse_Roof: null,
    conditionofHouse_Floor: null,
    conditionofHouse_Walls: null,
    biggestProblemintheCommunity: null,
    biggestProblemintheRegion: null,
    howCanWeFixIt: null,
    dayConvenience: null,
    hourConvenience:null,
    latitude: null,
    longitude: null
  };
  newSurvey =
  {
    fname: null,
    lname: null,
    dob: null,
    sex: null,
    marriageStatus: null,
    numberofIndividualsLivingintheHouse: null,
    numberofChildrenLivingintheHouse: null,
    numberofChildrenLivinginHouseUndertheAgeof5: null,
    occupation: null,
    educationLevel: null,
    telephoneNumber: null,
    yearsLivedinthecommunity: null,
    areyouamemberofthefollowingorganizations: null,
    whatTypeofHealthinsuranceDoyouHave: null,
    whatistheFrequencyofYourMedicalVisits: null,
    doyouhaveafamilyhistory: null,
    doyouhaveaDiagnosisfromadoctorforanyofthefollowing: null,
    doyouseeaproblemwithsexuallytransmitteddiseasesinyourcommunity: null,
    isTeenagepregnancyprevalentinyourcommunity: null,
    howOftenDoyouhaveAccesstoWater: null,
    typeofWaterdoyoudrink: null,
    clinicAccess: null,
    qualityClinicService: null,
    doyouhaveaccesstoalatrine: null,
    conditionoFloorinyourhouse: null,
    conditionoRoofinyourhouse: null,
    availableTrashManagementandDisposalServices: null,
    trashDisposalLocation: null,
    immediateCare: null,
    biggestProblemintheimmediatecommunity: null,
    biggestProblemintheregion: null,
    howCanweaddressandimprovethesituation: null,
    otherOrganizationsYouKnow: null,
    dayMostConvenient: null,
    hourMostConvenient: null,
    latitude: null,
    longitude: null
  }
  //Array used to Display Results from Query
  surveyPoints = []

  constructor(private parseProvider: ParseProvider, private auth: AuthProvider,  private app: App, private geolocation:Geolocation) {
    this.listPoints();
  }

  ionViewCanEnter(): boolean {
    return this.auth.authenticated();
  }
  ionViewDidEnter() {
    //Gets User Position once user has entered homepage
    this.getUserPosition();
  
  }

  //List
  // This Function is for the Bottom Part of the Survey
  public listPoints(): Promise<any> {
    //Creates a natural "skip" of certain results based on surveyPoints length
    let offset = this.surveyPoints.length;

    //Limits the length of the searched results
    let limit = 10;

    //Returns the query then displays those "result" by pushing into surveyPoints object
    return this.parseProvider.getSurveyPoints(offset, limit).then((result) => {
      for (let i = 0; i < result.length; i++) {
        let object = result[i];
        this.surveyPoints.push(object);
      }
    }, (error) => {
      console.log(error);
    });
  }

  //This function gets the coordinates of the user
  public getUserPosition() {
    this.options = {
      enableHighAccuracy : false
    };
    
    this.geolocation.getCurrentPosition(this.options).then((resp) => {
      let latitude = resp.coords.latitude;
      let longitude = resp.coords.longitude;
      
      this.newSurvey.latitude = latitude;
      this.newSurvey.longitude = longitude;
      console.log(latitude,longitude)
    }).catch((error) => {
      console.log('Error getting location',error);
    });
  }

  //Adds Element to parseServer (newSurvey)
  //Then adds element to local array (surveyPoint)
  //Then clears the Form/arrary (surveyPoint)
  public postSurveyConfirm() {
    this.parseProvider.addSurveyResults(this.newSurvey).then((surveyPoint) => {
      this.surveyPoints.push(surveyPoint);
      for (var key in this.newSurvey){
        this.newSurvey[key] = null;
      }
    }, (error) => {
      console.log(error);
      alert('Error Confirming.');
    });
    //Update User Position?
    this.getUserPosition();
  }

  public signout() {
    this.auth.signout().subscribe(() => {
      this.app.getRootNav().setRoot(SigninPage);
    });
  }

}
