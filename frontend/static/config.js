// sitewide variables

export const date      = new Date();                           
export const year      = date.getFullYear();
export const month     = date.getMonth();
export const lastday   = new Date(year, month + 1, 0).getDate(); 
export let unit        = "WGT";

export const DoW = 
[
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

export const months =
[
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
];

export const colors = ['mediumspringgreen', 'orange', 'purple', 'cyan' ,'yellow' , 'white' , 'violet'];

const devConfig = {

    API_URL: "http://localhost:5001/",
    DEBUG_MODE: true,
    LIFTERS_ENDPOINT: "lifters",
    LIFTER_ENDPOINT: "lifter",
    WORKOUT_ENDPOINT: "workout",
    SET_ENDPOINT: "createSet",
    UPDATE_SET_NUMBER: "updateSetNumber",
    REORDER__SET_ENDPOINT: "reorderSetNumbers",
    GET_EXERCISES_ENDPOINT: "getExercises",
    INSERT_NEW_EXERCISE_ENDPOINT: "insertNewExerciseIntoWorkout",
    CREATE_WORKOUT_ENDPOINT: "createWorkout",
    DELETE_FROM_EORDER: "ExerciseOrder",
    CHECK_IF_WORKOUT_EXISTS: "workoutExistCheck",
    GET_MONTHLY_LIFTS: "monthlyWorkouts",
    monthlyVolume: "getMonthlyTrainingVolume",
    monthlyInetensity: "getMonthlyTrainingInensity",
    monthlyFrequency: "getMonthlyTrainingFrequency",
    GET_PR_DATA_FOR_LIFT: "getPRDataForLift",
    GET_EXERCISE_INFO: "getExerciseInfo",
    SAVE_SESSION_NOTE: "saveSessionNote",
    UPLOAD_SET_VIDEO: "uploadSetVideo",
    UPDATE_SESSION_NAME: "updateSessionName",
    LOGIN: "login",
    GET_LIFTER_BY_USER_NAME : "lifterByUserName",
    SEARCH_FOR_LIFTER: "searchForLifter",
    FOLLOW_LIFTER: "followLifter",
    DO_I_FOLLOW: "doIfollow"

  };
  

const prodConfig = {

    API_URL : "https://5q3n5f0d-5001.use.devtunnels.ms/", 
    DEBUG_MODE : false,
    LIFTERS_ENDPOINT : "lifters",
    LIFTER_ENDPOINT : "lifter",
    WORKOUT_ENDPOINT : "workout",
    SET_ENDPOINT : "createSet",
    UPDATE_SET_NUMBER : "updateSetNumber",
    REORDER__SET_ENDPOINT : "reorderSetNumbers",
    GET_EXERCISES_ENDPOINT : "getExercises",
    INSERT_NEW_EXERCISE_ENDPOINT : "insertNewExerciseIntoWorkout",
    CREATE_WORKOUT_ENDPOINT : "createWorkout",
    DELETE_FROM_EORDER : "ExerciseOrder",
    CHECK_IF_WORKOUT_EXISTS : "workoutExistCheck",
    GET_MONTHLY_LIFTS : "monthlyWorkouts",
    monthlyVolume : "getMonthlyTrainingVolume",
    monthlyInetensity : "getMonthlyTrainingInensity",
    monthlyFrequency : "getMonthlyTrainingFrequency",
    GET_PR_DATA_FOR_LIFT : "getPRDataForLift",
    GET_EXERCISE_INFO : "getExerciseInfo",
    SAVE_SESSION_NOTE: "saveSessionNote",
    UPLOAD_SET_VIDEO: "uploadSetVideo",
    UPDATE_SESSION_NAME: "updateSessionName",
    LOGIN: "login",
    GET_LIFTER_BY_USER_NAME : "lifterByUserName",
    SEARCH_FOR_LIFTER: "searchForLifter",
    FOLLOW_LIFTER: "followLifter",
    DO_I_FOLLOW: "doIfollow"

  };

export const endpoint = window.location.hostname === "localhost" ? 
  	devConfig : prodConfig;

export const DASH_HEADER_VARS = {

	dashHeaderClass         : "dashHeader",
	dashHeaderTitle		      : "dashHeaderTitle",
	minimizerClass		      : "minimizer",
	minimizerIcon	 	        : "-",
  expanderIcon	 	        : "+"
  
}

export const PR_DASH_VARIABLES = {

  	prDashClass            : "prDash",
	  prDashVisibleClass     : "prDashVisible",
  	prRepsTitleClass       : "prRepsTitle",  
  	prCellClass            : "prCell", 

  	prDashMinimizerIcon    : DASH_HEADER_VARS.minimizerIcon,
	  prDashHeaderClass      : DASH_HEADER_VARS.dashHeaderClass,
  	prDashHeaderTitleClass : DASH_HEADER_VARS.dashHeaderTitle,
	  prDashMinimizerClass   : DASH_HEADER_VARS.minimizerClass,
	  prDashHeaderId		     : "prDashHeader",
	  prDashMinimizerId      : "prDashMinimizer",
  	prDashText             : "PR DASH",
  	repNumInHeader         : "repNumInHeader",
    repNumBox              : "repNumBox",
   	repPRboxClass          : "repPRbox",
  	repPRrowClass          : "prLiftRow",
  	repPRliftNameBoxClass  : "prLiftNameBox",
  	repPRliftNameWrapClass : "prLiftName"

};

export const MONTHLY_CHARTS_DASH_VARIABLES = {

	  mChartDashClass				  : "monthlyChartDash",
    mChartDashClassVisible	: "monthlyChartDashVisible",
    mChartDashHeaderClass 	: DASH_HEADER_VARS.dashHeaderClass,
	  mChartDashHeaderTitleClass : DASH_HEADER_VARS.dashHeaderTitle,
	  mChartMinimizerIcon			: DASH_HEADER_VARS.minimizerIcon,
	  mChartMinimizerClass		: DASH_HEADER_VARS.minimizerClass,
	  mChartDashText				  : "MONTHLY LIFT DATA",
	  mChartDashHeaderId			: "monthChartDashHeader",
	  mChartMinimizerId			  : "mChartMinimizer"

}
