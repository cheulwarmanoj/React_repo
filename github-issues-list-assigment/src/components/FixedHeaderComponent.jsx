import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const titleCase = (inStr) => {
    return inStr.replace(/\w\S*/g, function (tStr) {
        return tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase();
    });
}
function doModal(show) {
    return (previousState) => {
        return { ...previousState, modal: show };
    };
}
const NavbarButtonGroup = ({ buttonArray, filterType, clickFunction, listFilter }) => {
    return (
        <div className="buttons has-addons" onClick={clickFunction}>
            {}
        </div>
    )
}

class FixedHeaderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: "https://github.githubassets.com/images/icons/emoji/octocat.png",
            modal: "",
            headline:"GitHub Issue List"

        };
        this.handleFilter = this.handleFilter.bind(this);
        this.handleRepo = this.handleRepo.bind(this);
        this.getAvatar = this.getAvatar.bind(this);
        this.showModal = this.showModal.bind(this);
      
    }

    componentDidMount() {
        this.getAvatar()

    }

    shouldComponentUpdate(previousProps, previousState) {
        if (previousProps.listFilter !== this.props.listFilter) {
            return true;
        }
        if (previousProps.user !== this.props.user) {
            return true;
        }
        if (previousState.avatar !== this.state.avatar) {
            return true;
        }
        if (previousState.modal !== this.state.modal) {
            return true;
        }
        return false;
    }

    getAvatar(nnew, user, repo) {
        const headers = {
            headers: {
                Authorization: "token 60e07ff280c786e523a632be9af8f992270a5c5b",
                Accept: "application/vnd.github.v3+json,application/vnd.github.machine-man-preview+json",
            }
        };
        const baseUrl = "https://api.github.com/repos"
        const avatarUrlBase = nnew ? `${baseUrl}/${user}/${repo}` : `${baseUrl}/${this.props.user}/${this.props.repo}`


        fetch(avatarUrlBase, headers)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error('Request failed.');
            }).then(data => {
                this.setState({ avatar: data.owner.avatar_url, modal: "" })
            })
    }

    handleFilter(e) {
        e.preventDefault();
        const value = e.target.dataset.choice
        const type = e.target.dataset.listFilter
        let obj = {}
        obj[type] = value
        this.props.onFilterChange(obj);
    }
    handleRepo(e) {
        e.preventDefault();
        this.getAvatar(true, this.user.value, this.repo.value)
        this.props.onRepoChange(this.user.value, this.repo.value);

    }
    showModal(e) {
        e.preventDefault();
        console.log(e)
        if (this.state.modal !== true) {
            this.setState(doModal(true))
        } else {
            this.setState(doModal(false))
        }


    }
    
    render() {

        const date = new Date(this.props.since);
        const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString()
            .split("T")[0];

        const { state, choice } = this.props.listFilter
        const titleString = `${titleCase(state)} ${choice === "all" ? "issues/PRs" : choice} since ${dateString}`
        return (

            <nav className="navbar is-fixed-top navbar-center panel-heading" role="navigation">
                {
                    <div className="navbar-center">
                        <div id="navbarBasicExample" className="navbar-menu navbar-center">
                            <span className="navbar-item ">
                            <span className="info-container">{this.state.headline}</span>
                            </span>
                        </div>
                    </div>
                }
            </nav>
        );
    }
}
export default FixedHeaderComponent;