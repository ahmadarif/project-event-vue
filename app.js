// link: https://scotch.io/tutorials/build-an-app-with-vue-js-a-lightweight-alternative-to-angularjs

Vue.http.options.root = 'http://localhost:8000/api/v1';

new Vue({
    el: '#events',

    // Here we can register any values or collections that hold data
    // for the application
    data: {
        event: { id: '', name: '', description: '', date: '' },
        eventShowed: {},
        events: [],
        isModalDeleteShow: false
    },

    // Anything within the ready function will run when the application loads
    ready: function() {
        // When the application loads, we want to call the method that initializes
        // some data
        this.fetchEvents();
    },

    // Methods we want to use in our application are registered here
    methods: {
        // We dedicate a method to retrieving and setting some data
        fetchEvents: function() {
            // get data from backend
            this.$http.get('event').then((response) => {
                // success callback
                this.$set('events', response.json().data);
            }, (response) => {
                // error callback
                console.log(response);
            });
        },
        
        // Adds an event to the existing events array
        addEvent: function() {
            if(this.event.name) {
                var localEvent = {
                    name: this.event.name,
                    description: this.event.description,
                    date: this.event.date
                };

                // insert data to backend
                this.$http.post('event', localEvent).then((response) => {
                    // success callback
                    this.event.id = response.json().data.id;
                    this.events.push(this.event);
                    this.event = {};
                }, (response) => {
                    // error callback
                    console.log(response);
                });
            }
        },

        deleteEvent: function(index, isConfirm) {
            var localEvent = this.events[index];

            if (!isConfirm) {
                this.eventShowed = {
                    index: index,
                    id: localEvent.id,
                    name: localEvent.name,
                    description: localEvent.description,
                    date: localEvent.date
                }

                $('#modal-delete').modal();
            } else {
                // POST data to backend
                this.$http.delete('event/' + localEvent.id).then((response) => {
                    // success callback
                    if (response.json().success) {
                        this.events.splice(index, 1);
                    }
                }, (response) => {
                    // error callback
                    console.log(response);
                });
            }
            
        },

        showEvent: function(index) {
            var localEvent = this.events[index];

            this.eventShowed = {
                index: index,
                id: localEvent.id,
                name: localEvent.name,
                description: localEvent.description,
                date: localEvent.date
            }
        },

        updateEvent: function(event) {
            // object send to backend
            var localEvent = {
                name: event.name,
                description: event.description,
                date: event.date
            };

            // update data to backend
            this.$http.put('event/' + event.id, localEvent).then((response) => {
                // success callback                
                // update events
                if (response.json().success) {
                    this.events[event.index].id = response.json().data.id;
                    this.events[event.index].name = response.json().data.name;
                    this.events[event.index].description = response.json().data.description;
                    this.events[event.index].date = response.json().data.date;
                }
            }, (response) => {
                // error callback
                console.log(response);
            });
        },

        updateName: function(name) {
            alert(name);
        }
    }
});