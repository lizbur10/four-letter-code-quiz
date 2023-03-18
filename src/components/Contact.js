import { useState } from "react";
import {
  Modal,
  Checkbox,
  Form,
  Input,
  Button,
  TextArea,
} from "semantic-ui-react";

function Contact() {
  const [contactInfo, setContactInfo] = useState({
    email: "",
    comment: "",
    firstChecked: false,
    secondChecked: false,
  });

  const onFormSubmit = (event) => {
    event.preventDefault();
    console.log(contactInfo);
  };

  return (
    <Modal open={this.props.open}>
      <Modal.Content>
        <Modal.Header className="ui container">
          <h2>Contact the developer:</h2>
        </Modal.Header>
        <Form onSubmit={(e) => this.onFormSubmit(e)} size="huge">
          <Form.Field required>
            <label>Your Email:</label>
            <Input
              focus
              placeholder="Email"
              value={contactInfo.email}
              onChange={(event) =>
                setContactInfo({ email: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field required>
            <label>Comment:</label>
            <TextArea
              value={setContactInfo.comment}
              onChange={(event) =>
                setContactInfo({ comment: event.target.value })
              }
            />
          </Form.Field>
          {/* <Form.Field style={{display: "none"}}> */}
          <Form.Field>
            <Checkbox
              label="Add me to the mailing list"
              value="this"
              checked={contactInfo.firstChecked}
              onChange={() =>
                setContactInfo({ firstChecked: !contactInfo.firstChecked })
              }
            />
          </Form.Field>
          {/* <Form.Field style={{display: "none"}}> */}
          <Form.Field>
            <Checkbox
              label="I'm interested in volunteering"
              value="that"
              checked={contactInfo.secondChecked}
              onChange={() =>
                setContactInfo({ secondChecked: !contactInfo.secondChecked })
              }
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

export default Contact;
