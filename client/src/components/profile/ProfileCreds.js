import React, { Component } from "react";
import Moment from "react-moment";

class ProfileCreds extends Component {
  render() {
    const { experience, education } = this.props;

    const expItems = experience.map(item => (
      <li key={item._id} className="list-group-item">
        <h4>{item.company}</h4>
        <p>
          <em>
            <Moment format="MMM YYYY">{item.from}</Moment>
          </em>{" "}
          -
          {item.to === null ? (
            " Current"
          ) : (
            <em>
              <Moment format="MMM YYYY">{item.to}</Moment>
            </em>
          )}
        </p>
        <p>
          <strong>Position</strong> {item.title}
        </p>
        <p>
          {item.location === "" ? null : (
            <span>
              <strong>Location: </strong> {item.location}
            </span>
          )}
        </p>
        <p>
          {item.description === "" ? null : (
            <span>
              <strong>Description: </strong> {item.description}
            </span>
          )}
        </p>
      </li>
    ));

    const eduItems = education.map(item => (
      <li key={item._id} className="list-group-item">
        <h4>{item.school}</h4>
        <p>
          <em>
            <Moment format="MMM YYYY">{item.from}</Moment>
          </em>{" "}
          -
          {item.to === null ? (
            " Current"
          ) : (
            <em>
              <Moment format="MMM YYYY">{item.to}</Moment>
            </em>
          )}
        </p>
        <p>
          <strong>Degree: </strong> {item.degree}
        </p>
        <p>
          <strong>Field of Study: </strong> {item.fieldofstudy}
        </p>
        <p>
          {item.description === "" ? null : (
            <span>
              <strong>Description: </strong> {item.description}
            </span>
          )}
        </p>
      </li>
    ));

    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          {expItems.length > 0 ? (
            <ul className="list-group">{expItems}</ul>
          ) : (
            <p className="text-center">No Experience Listed</p>
          )}
        </div>
        <div className="col-md-6">
          <h3 className="text-center text-info">Education</h3>
          {eduItems.length > 0 ? (
            <ul className="list-group">{eduItems}</ul>
          ) : (
            <p className="text-center">No Education Listed</p>
          )}
        </div>
      </div>
    );
  }
}

export default ProfileCreds;
