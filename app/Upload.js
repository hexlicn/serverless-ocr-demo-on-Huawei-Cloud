import React, { Component } from "react";
import FileBase64 from "react-file-base64";
import { Button, Form, FormGroup, Label, FormText, Input } from "reactstrap";

import "./upload.css";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faCofee } from '@fortawesome/free-solid-svg-icons';

class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmation: "",
      isLoading: "",
      files: "",
      idcardno: "",
      fullname: "",
      birthday: "",
      address: "",
      issuedate: "",
      expiredate: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ name: value });
  }

  // async handleSubmit(event){
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ confirmation: "Uploading..." });

    var putdata = {
      idcardno: this.state.idcardno,
      fullname: this.state.fullname,
      birthday: this.state.birthday,
      address: this.state.address,
      issuedate: this.state.issuedate,
      expiredate: this.state.expiredate,
    };
    fetch(
      "http://c4855b08f9c54759b57a29e2bf2443ee.apig.ap-southeast-2.huaweicloudapis.com/storedb",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application.json",
        },
        body: JSON.stringify(putdata),
      }
    ).then(() => {
        this.setState({ confirmation: "Success stored into database, Please double check with it!" });
      }).catch((err) => {
        console.log(err);
      });
  }

  async getFiles(files) {
    this.setState({
      isLoading: "Extracting data",
      files: files,
    });

    const UID = Math.round(1 + Math.random() * (1000000 - 1));
    var data = {
      fileExt: "png",
      imageID: UID,
      folder: UID,
      img: this.state.files[0].base64,
    };

    this.setState({ confirmation: "Processing ID card..." });

    await fetch(
      "http://c4855b08f9c54759b57a29e2bf2443ee.apig.ap-southeast-2.huaweicloudapis.com/obs",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application.json",
        },
        body: JSON.stringify(data),
      }
    );

    let targetImage = UID + ".png";
    const response = await fetch(
      "http://c4855b08f9c54759b57a29e2bf2443ee.apig.ap-southeast-2.huaweicloudapis.com/ocr",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application.json",
        },
        body: JSON.stringify(targetImage),
      }
    );

    this.setState({ confirmation: "" });

    this.setState({
      imageUrl: `//react-ap-webapp-images.obs.ap-southeast-2.myhuaweicloud.com/${UID}.png`,
    });

    const OCRBody = await response.json();
    console.log("OCRBody", OCRBody);

    this.setState({ idcardno: OCRBody.idcard_no });
    this.setState({ fullname: OCRBody.full_name_th });
    this.setState({ birthday: OCRBody.birthday_th });
    this.setState({ address: OCRBody.addr_th });
    this.setState({ issuedate: OCRBody.issue_date_th });
    this.setState({ expiredate: OCRBody.expired_date_th });
  }

  render() {
    const processing = this.state.confirmation;
    return (
      <div className="row">
        <div className="col-6 offset-3">
          <img
            src={this.state.imageUrl}
            style={{
              height: this.state.idcardno ? "300px" : "0px",
              margin: "auto",
            }}
          />
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <h3 className="text-danger">{processing}</h3>
              <h6>Upload ID Card</h6>
              <FormText color="muted">
                Please Upload snapshot postfix with .PNG
              </FormText>

              <div className="form-group files color">
                <FileBase64
                  multiple={true}
                  onDone={this.getFiles.bind(this)}
                ></FileBase64>
              </div>
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>ID Card No.</h6>
              </Label>
              <Input
                type="text"
                name="ID Card Number"
                id="ID Card Number"
                required
                value={this.state.idcardno}
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Full Name</h6>
              </Label>
              <Input
                type="text"
                name="Full Name"
                id="Full Name"
                required
                value={this.state.fullname}
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Birthday</h6>
              </Label>
              <Input
                type="text"
                name="Birthday"
                id="Birthday"
                required
                value={this.state.birthday}
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Address</h6>
              </Label>
              <Input
                type="text"
                name="Address"
                id="Address"
                required
                value={this.state.address}
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Issue Date</h6>
              </Label>
              <Input
                type="text"
                name="Issue Date"
                id="Issue Date"
                required
                value={this.state.issuedate}
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Expire Date</h6>
              </Label>
              <Input
                type="text"
                name="Expire Date"
                id="Expire Date"
                required
                value={this.state.expiredate}
                onChange={this.handleChange}
              />
            </FormGroup>

            <Button className="btn btn-lg btn-block btn-success">Submit to backend DB</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Upload;
