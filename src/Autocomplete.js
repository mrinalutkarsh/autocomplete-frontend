import React, { Component } from 'react';
import _ from 'lodash';

export class Autocomplete extends Component {

    constructor(){
        super();
        // this.dbsearch = (userInput) => debounce(() =>{ 
        //     this.fetchApi(userInput)
        // }, 500);

        this.dbsearch = _.debounce(function(userInput) {
            //console.log('Debounced Event:', e);
            this.fetchApi(userInput)
          }, 300)
    }

    state = {
        activeOption: 0,
        filteredOptions: [],
        showOptions: false,
        userInput: ''
    };

    onChange = (e) => {
        console.log('onChanges');
        this.setState({
            userInput: e.currentTarget.value
        }, () => {
            const { userInput } = this.state;
            // this.fetchApi(userInput)
            this.dbsearch(userInput);
        });

    };

    fetchApi = (userInput) => {
        // debugger;
        fetch(`http://localhost:9090/search/${userInput}`)
            .then((p1) => Promise.resolve(p1))
            .then((p1) => p1.json())
            .then((p1) => {
                console.log(p1);
                this.setState({
                    filteredOptions: p1,
                    activeOption: 0,
                    showOptions: true
                })
            });
    }
        

    onClick = (e) => {
        this.setState({
            activeOption: 0,
            filteredOptions: [],
            showOptions: false,
            userInput: e.currentTarget.innerText
        });
    };
    onKeyDown = (e) => {
        const { activeOption, filteredOptions } = this.state;

        if (e.keyCode === 13) {
            this.setState({
                activeOption: 0,
                showOptions: false,
                userInput: filteredOptions[activeOption]
            });
        } else if (e.keyCode === 38) {
            if (activeOption === 0) {
                return;
            }
            this.setState({ activeOption: activeOption - 1 });
        } else if (e.keyCode === 40) {
            if (activeOption === filteredOptions.length - 1) {
                console.log(activeOption);
                return;
            }
            this.setState({ activeOption: activeOption + 1 });
        }
    };

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,

            state: { activeOption, filteredOptions, showOptions, userInput }
        } = this;
        let optionList;
        if (showOptions && userInput) {
            if (filteredOptions.length) {
                optionList = (
                    <ul className="options">
                        {filteredOptions.map((optionName, index) => {
                            let className;
                            if (index === activeOption) {
                                className = 'option-active';
                            }
                            return (
                                <li className={className} key={optionName} onClick={onClick}>
                                    {optionName}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                optionList = (
                    <div className="no-options">
                        <em>No Option!</em>
                    </div>
                );
            }
        }
        return (
            <React.Fragment>
                <div className="search">
                    <input
                        type="text"
                        className="search-box"
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        value={userInput}
                    />
                    <input type="submit" value="" className="search-btn" />
                </div>
                {optionList}
            </React.Fragment>
        );
    }
}

export default Autocomplete;
