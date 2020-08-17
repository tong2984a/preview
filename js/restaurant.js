module.exports = Restaurant;

class Restaurant {
    constructor(marker, name, location, dishes) {
        this.marker = marker;
        this.name = name;
        this.location = location;
        this.dishes = dishes;
    }var

    getName() {
        return this.name;
    }

    getMarker() {
        return this.marker;
    }

    getLocation() {
        return this.location;
    }

    getDishes() {
        return this.dishes;
    }

    filterDishes(filterTags, tagsNum) {
        var dishSection = document.createElement("div")
        dishSection.id = "dishSection";
        document.getElementById("slideContainer").appendChild(dishSection);
        var dishMatch = 0;
        dishes.array.forEach(element => {
            var check = 0;
            filterTags.forEach(value => {
                if(element.tags[value].value){
                    check++;
                }
            })
            if(check == tagsNum){
                dishMatch++;
                var name = document.createElement("h5");
                name.innerText = element.dish;
                document.getElementById('dishSection').appendChild(name)
                var photo = document.createElement("img");
                photo.src = element.fileURL;
                photo.style.width = '150px' 
                document.getElementById('dishSection').appendChild(photo);                
                var tags = element.tags;
                var tagString = '';
                var makeTagString = tags.forEach((tags) => {
                    if(tags.value == true){
                        tagString += '#' + tags.name + '  ';
                    };
                });
                var tag = document.createElement('h6');
                tag.innerText = tagString;
                document.getElementById('dishSection').appendChild(tag); 
            }
        });
    }
}
