export const date      = new Date();                           
export const year      = date.getFullYear();
export const month     = date.getMonth();
export const lastday   = new Date(year, month + 1, 0).getDate(); 

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
    CHECK_IF_WORKOUT_EXISTS: "workoutExistCheck"
  };
  

const prodConfig = {
    API_URL: "https://5q3n5f0d-5001.use.devtunnels.ms/", 
    DEBUG_MODE: false,
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
    CHECK_IF_WORKOUT_EXISTS: "workoutExistCheck"
  };

export const config = window.location.hostname === "localhost" ? 
  devConfig : prodConfig;