
var SearchContainer = React.createClass({
    loadItemsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                console.log("DATA - establishments: ", data.establishments);
                console.log("DATA - locations: ", data.locations);
                this.setState({establishments: data.establishments, locations: data.locations})
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this),
        });
    },
    getInitialState: function() {
        return {
            establishments: [],
            locations: [],
            country: "",
            region: "",
            county: "",
            town: ""
        };
    },
    componentDidMount: function() {
        this.loadItemsFromServer();
        //setInterval(this.loadItemsFromServer, this.props.pollInterval)
    },
    submitForm: function(country, region, county, town) {
        this.setState({
            country: country,
            region: region,
            county: county,
            town: town
        });
    },
    render: function() {
        return (
            <div className="search-container">
                SEARCH CONTAINER
                <SearchForm data={this.state.locations}
                    onSubmit={this.submitForm} />
                <SearchResult
                    data={this.state.establishments}
                    country={this.state.country}
                    region={this.state.region}
                    county={this.state.county}
                    town={this.state.town}
                    />
            </div>
        );
    }
});

var SearchForm = React.createClass({
    getInitialState: function() {
        return {
            //options_1: [],
            options_1: ["Ireland", "Wales", "England", "Scotland"],
            options_2: [],
            options_3: [],
            options_4: [],
            selected_1: "",
            selected_2: "",
            selected_3: "",
            selected_4: ""
        };
    },
    componentDidMount: function () {
        //var locations = this.props.data;
        //var items_1 = Object.keys(locations);
        //console.log("items_1: " + items_1);
    },
    handleChange: function(event) {
        var el = event.target;
        var selected_value = el.value;
        var select_id = el.id;

        var locations = this.props.data;

        switch (select_id) {
            case "select-1":
                this.setState({selected_1: selected_value});
                var items_2 = Object.keys(locations[selected_value]);
                this.setState({options_2: items_2, options_3: [], options_4: []});
                //this.props.onSubmit(selected_value, "", "", "");
                break;
            case "select-2":
                this.setState({selected_2: selected_value});
                var items_3 = Object.keys(locations[this.state.selected_1][selected_value]);
                this.setState({options_3: items_3, options_4: []});
                break;
            case "select-3":
                this.setState({selected_3: selected_value});
                var items_4 = locations[this.state.selected_1][this.state.selected_2][selected_value];
                this.setState({options_4: items_4});
                break;
            case "select-4":
                this.setState({selected_4: selected_value});
        }
    },
    handleSubmit: function(event) {
        event.preventDefault();
        this.props.onSubmit(this.state.selected_1, this.state.selected_2, this.state.selected_3, this.state.selected_4);
    },
    render: function() {
        return (
            <div className="search-form">
                SEARCH FORM
                <SelectField options={this.state.options_1} selectId="select-1" handleChange={this.handleChange} />
                <SelectField options={this.state.options_2} selectId="select-2" handleChange={this.handleChange} />
                <SelectField options={this.state.options_3} selectId="select-3" handleChange={this.handleChange} />
                <SelectField options={this.state.options_4} selectId="select-4" handleChange={this.handleChange} />

                <a href="#" onClick={this.handleSubmit}>SUBMIT</a>
            </div>
        );
    }
});

var SearchResult = React.createClass({
    render: function() {
        var resultItems = [];

        this.props.data.forEach(function(item){
            //if (item.country === "Wales") {
            //    debugger;
            //}
            if ((this.props.country === "") || (this.props.country === item.country)) {
                if ((this.props.region === "") || (this.props.region === item.region)) {
                    if ((this.props.county  === "") || (this.props.county === item.county)) {
                        if ((this.props.town === "") || (this.props.town === item.town)) {
                            resultItems.push(<ResultItem name={item.name} country={item.country} region={item.region} county={item.county} town={item.town} key={item.id}>{item.intro}</ResultItem>);
                        }
                    }
                }
            }
        }.bind(this));

        return (
            <div className="search-result">
                {resultItems}
            </div>
        );
    }
});

var SelectField = React.createClass({
    render: function() {
        var options = this.props.options.map(function(option) {
            return (
                <option value={option} key={option}>{option}</option>
            );
        });
        return (
            <select id={this.props.selectId} className="select-field"
                ref={this.props.selectId}
                onChange={this.props.handleChange}>
                <option>Please select</option>
                {options}
            </select>
        );
    }
});

var ResultItem = React.createClass({
    render: function() {
        return (
            <div className="result-item">
                <h4>{this.props.name}</h4>
                Country: {this.props.country} <br />
                Region: {this.props.region} <br />
                County: {this.props.county} <br />
                Town: {this.props.town} <br />
                Descriptive text: {this.props.children}
            </div>
        );
    }
});

ReactDOM.render(
    <SearchContainer url="/api/tradestays" pollInterval={2000} />,
    document.getElementById('content')
);
