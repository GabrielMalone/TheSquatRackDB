export default class Lifter {

    #userName;
    #firstName;
    #lastName;
    #id;
    #email;
    #age;
    #weight;
    #height;
    #photo;

    #prDashSelection = []; // so that selections persist within and between app visits

    #federation;
    #weightClass;

    constructor({Email = "N/A", idUser = null, userFirst = "N/A", userLast = "N/A", userName = "N/A"} = {}){
        this.#userName  = userName;
        this.#firstName = userFirst;
        this.#lastName  = userLast;
        this.#id        = idUser;
        this.#email     = Email;
    }

    set userName(userName){
        this.#userName = userName;
    }
    get userName(){
        return this.#userName
    }
    set firstName(firstName){
        this.#firstName = firstName;
    }
    get firstName(){
        return this.#firstName;
    }
    set lastName(lastName){
        this.#lastName = lastName;
    }
    get lastName(){
        return this.#lastName;
    }
    get id(){
        return this.#id;
    }
    set email(email){
        this.#email = email;
    }
    get email(){
        return this.#email;
    }
    set age(age){
        this.#age = age;
    }
    get age(){
        return this.#age;
    }
    set weight(weight){
        this.#weight = weight;
    }
    get weight(){
        return this.#weight;
    }
    set height(height){
        this.#height = height;
    }
    get height(){
        return this.#height;
    }
    set photo(photo){
        this.#photo = photo;
    }
    get photo(){
        return this.#photo;
    }
    set prDashSelection(idExercise){
        this.#prDashSelection.push(idExercise);
    }
    get prDashSelection(){
        return this.#prDashSelection;
    }

    removePrDashSelection(liftId){
        const updatedLiftSelection = this.#prDashSelection.filter(lift=>lift !== liftId);
        this.#prDashSelection = updatedLiftSelection;
    }

}