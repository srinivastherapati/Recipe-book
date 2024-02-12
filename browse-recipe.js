var jsonData = [];
var recipeData = [];
var recipeDataCopy = [];
var lastClickedRecipeId = null;
//AJAX Request to read local JSON file
function readLocalJsonFileWithAjax() {

    if(localStorage.getItem("jsonData") != null){
        jsonData = JSON.parse(localStorage.getItem("jsonData"));
        recipeData = jsonData["recipes"];
        recipeDataCopy = recipeData;
        localStorage.setItem("lastUsedId", jsonData.lastUsedId);
        addDataToDisplay();
        document.getElementById("searchBox").addEventListener("input", handleSearch);
        return;
    }

    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            jsonData = data;
            recipeData = jsonData["recipes"];
            recipeDataCopy = jsonData["recipes"];
            console.log('Data from local JSON file (AJAX):', data);
            localStorage.setItem("lastUsedId", data["lastUsedId"]);
            // Do something with the data
            addDataToDisplay();
            document.getElementById("searchBox").addEventListener("input", handleSearch);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            console.error('Error reading local JSON file (AJAX):', xhr.statusText);
        }
    };

    xhr.open('GET', 'recipe-list.json', true);
    xhr.send();
}

//Adding Data Dynamically to The browse page
function addDataToDisplay() {
    let recipes = recipeDataCopy;
    for( let i=0;i<recipes.length;i++){
        let recipe = recipes[i];
        let recipeDiv = document.createElement("div");
        recipeDiv.setAttribute("class", "recipe-container ");
        recipeDiv.setAttribute("id", "recipe"+recipe.id);
        let recipeImg = document.createElement("img");
        recipeImg.setAttribute("src", recipe.image);
        recipeImg.setAttribute("class", "recipe-img zoomable");
        recipeImg.setAttribute("onclick", "navigateToRecipe(" + recipe.id + ")");
        recipeDiv.appendChild(recipeImg);
        let recipeTextContainer = document.createElement("div");
        recipeTextContainer.setAttribute("class", "text-center recipe-details");
        recipeTextContainer.setAttribute("onclick", "navigateToRecipe(" + recipe.id + ")");
        let recipeTitle = document.createElement("h3");
        recipeTitle.setAttribute("class", "recipe-title");
        recipeTitle.innerHTML = recipe.title;
        recipeTextContainer.appendChild(recipeTitle);
        let recipeCategory = document.createElement("p");
        recipeCategory.setAttribute("class", "recipe-attr");
        recipeCategory.innerHTML = "Category : "+recipe.category;
        recipeTextContainer.appendChild(recipeCategory)
        let recipeTime = document.createElement("p");
        recipeTime.setAttribute("class", "recipe-attr");
        recipeTime.innerHTML = "Prep Time : "+recipe.prep_time+" min";
        recipeTextContainer.appendChild(recipeTime);
        recipeDiv.appendChild(recipeTextContainer);

        let buttonContainer = document.createElement("div");
        buttonContainer.setAttribute("class", "d-flex justify-content-around mt-3");
        let buttonEdit = document.createElement("button");
        buttonEdit.setAttribute("class", "btn btn-outline-primary");
        buttonEdit.innerHTML = "Edit";
        buttonEdit.setAttribute("onclick", "navigateToEdit(" + recipe.id + ")");
        buttonContainer.appendChild(buttonEdit);

        let buttonDelete = document.createElement("button");
        buttonDelete.setAttribute("class", "btn btn-outline-danger");
        buttonDelete.innerHTML = "Delete";
        buttonDelete.setAttribute("onclick", "deleteRecipe(" + recipe.id + ")");

        buttonContainer.appendChild(buttonDelete);
        recipeDiv.appendChild(buttonContainer);

        let recipeContainer = document.getElementById("recipe-container-main");
        recipeContainer.appendChild(recipeDiv);
    }
}

function clearDisplay(){
    let recipeContainer = document.getElementById("recipe-container-main");
    recipeContainer.innerHTML = "";
}

function handleSearch(event){
    clearFilters();
    let searchTerm = event.target.value.trim();
    if(searchTerm.length > 0){
        recipeDataCopy = [];
        for(let i=0;i<recipeData.length;i++){
            if(recipeData[i].title.toLowerCase().includes(searchTerm.toLowerCase())){
                recipeDataCopy.push(recipeData[i]);
            }
            else if(recipeData[i].category.toLowerCase().includes(searchTerm.toLowerCase())){
                recipeDataCopy.push(recipeData[i]);
            }
            else if(recipeData[i].cusine_style.toLowerCase().includes(searchTerm.toLowerCase())){
                recipeDataCopy.push(recipeData[i]);
            }
        }
        clearDisplay();
        addDataToDisplay();
    }
    else{
        recipeDataCopy = recipeData;
        clearDisplay();
        addDataToDisplay();
    }
}

function clearFilters(){
    document.querySelector("#formCategory").value = "All";
    document.querySelector("#formCusine").value = "All";
    document.querySelector("#formTime").value = "All";
}

function applyFilters() {
    let categoryFilter = document.querySelector("#formCategory").value;
    let cusineFilter = document.querySelector("#formCusine").value;
    let timeFilter = document.querySelector("#formTime").value;
    recipeDataCopy = [];
    for(let i=0;i<recipeData.length;i++){
        if((recipeData[i].category == categoryFilter || categoryFilter=="All" )&& 
        (recipeData[i].cusine_style == cusineFilter || cusineFilter=="All" )
        && (parseInt(recipeData[i].prep_time) < parseInt(timeFilter) || timeFilter=="All")){
            recipeDataCopy.push(recipeData[i]);
        }
    }
    clearDisplay();
    addDataToDisplay();
}

function navigateToRecipe(id){
    var data = {};
    for(let i=0;i<recipeData.length;i++){
            if(recipeData[i].id == id){
                data = recipeData[i];
                break;
            }
    }
    localStorage.setItem("recipe", JSON.stringify(data));
    window.location.href = "view-recipe.html?id="+id;
}

function setRecipeDetails(){
    var data = JSON.parse(localStorage.getItem("recipe"));
    document.getElementById("recipeTitle").innerHTML = data.title;
    document.getElementById("recipeCategory").innerHTML = "Category : "+data.category;
    document.getElementById("recipeCusine").innerHTML = "Cusine Style : "+data.cusine_style;
    document.getElementById("recipePrepTime").innerHTML = "Prep Time : "+data.prep_time+" minutes";
    document.getElementById("recipeImage").setAttribute("src", data.image);

    var ingredients = '';
    for(let i=0;i<data.ingredients.length;i++){
        ingredients += "<li>"+data.ingredients[i]+"</li>";
    }
    document.getElementById("recipe-ingredients").innerHTML = ingredients;

    var instructions = '';
    for(let i=0;i<data.steps.length;i++){
        instructions += "<li>"+data.steps[i]+"</li>";
    }  
    document.getElementById("recipe-procedure").innerHTML = instructions;
}

function navigateToEdit(id){
    localStorage.setItem("operation", "edit");
    localStorage.setItem("recipeId",id);
    localStorage.setItem("recipeData",JSON.stringify(recipeData));
    window.location.href = "add-recipe.html";
}

function fillRecipeDetails(){
    let id = parseInt(localStorage.getItem("recipeId"));
    recipeData = JSON.parse(localStorage.getItem("recipeData"));
    recipeDataCopy = recipeData;

    if(localStorage.getItem("operation") == "add"){
        document.getElementById("recipeTitleAdd").value = "";
        document.getElementById("recipeCategoryAdd").value = "";
        document.getElementById("recipeCusineAdd").value = "";
        document.getElementById("recipeTimeAdd").value = "";
        document.getElementById("recipeImageid1").value =  "";
        document.getElementById("recipeIngredientsAdd").value = "";
        document.getElementById("recipeStepsAdd").value = "";
        return;
    }

    var data = null;
    for(let i=0;i<recipeData.length;i++){
        if(recipeData[i].id == id){
            data = recipeData[i];
            break;
        }
    }
    console.log(data);
    document.getElementById("recipeTitleAdd").value = data.title;
    document.getElementById("recipeCategoryAdd").value = data.category;
    document.getElementById("recipeCusineAdd").value = data.cusine_style;
    document.getElementById("recipeTimeAdd").value = data.prep_time;
    document.getElementById("recipeImageid1").value =  data.image;

    var ingredients = "";
    for(let i=0;i<data.ingredients.length;i++){
        ingredients += data.ingredients[i]+(i<data.ingredients.length-1 ? "\n" : "");
    }
    var steps = "";
    for(let i=0;i<data.steps.length;i++){
        steps += data.steps[i]+(i<data.steps.length-1? "\n" : "");
    }
    document.getElementById("recipeIngredientsAdd").value = ingredients;
    document.getElementById("recipeStepsAdd").value = steps;

}

function navigateToAdd(){
    localStorage.setItem("operation", "add");
    window.location.href = "add-recipe.html";
}

function saveData(){
    var operation = localStorage.getItem("operation");
    if(operation === "edit"){
        for(let i=0;i<recipeData.length;i++){
            if(recipeData[i].id == parseInt(localStorage.getItem("recipeId"))){
                recipeData[i].title = document.getElementById("recipeTitleAdd").value;
                recipeData[i].category = document.getElementById("recipeCategoryAdd").value;
                recipeData[i].cusine_style = document.getElementById("recipeCusineAdd").value;
                recipeData[i].prep_time = parseInt(document.getElementById("recipeTimeAdd").value);
                recipeData[i].image = document.getElementById("recipeImageid1").value;
                recipeData[i].ingredients = document.getElementById("recipeIngredientsAdd").value.split("\n");
                recipeData[i].steps = document.getElementById("recipeStepsAdd").value.split("\n");
                break;
            }
        }
    }
    else{
        var data = {};
        data.title = document.getElementById("recipeTitleAdd").value;
        data.category = document.getElementById("recipeCategoryAdd").value;
        data.cusine_style = document.getElementById("recipeCusineAdd").value;
        data.prep_time = parseInt(document.getElementById("recipeTimeAdd").value);
        data.image = document.getElementById("recipeImageid1").value;
        data.ingredients = document.getElementById("recipeIngredientsAdd").value.split("\n");
        data.steps = document.getElementById("recipeStepsAdd").value.split("\n");
        data.id =  parseInt(localStorage.getItem("lastUsedId"));
        if(recipeData == null){
            recipeData = [];
        }
        recipeData.push(data)
    }
    var addedJson = {
        "recipes" : recipeData,
        "lastUsedId" : parseInt(localStorage.getItem("lastUsedId"))+1
    }
    writeToJson(addedJson);
    alert("Recipe Added Successfully");
}

function writeToJson(data){
    localStorage.setItem("jsonData", JSON.stringify(data));
}

function deleteRecipe(id){
    for(let i=0;i<recipeData.length;i++){
        if(recipeData[i].id == id){
            recipeData.splice(i,1);
            break;
        }
    }
    var addedJson = {
        "recipes" : recipeData,
        "lastUsedId" : parseInt(localStorage.getItem("lastUsedId"))+1
    }
    writeToJson(addedJson);
    clearFilters();
    clearDisplay();
    recipeDataCopy = recipeData;
    addDataToDisplay();
    alert("Deleted Recipe Successfully");
}