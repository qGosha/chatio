import * as React from 'react';
import { Button } from 'semantic-ui-react';


const FileButton = props => {
  const id = 'fileButton';
  const onChangeFile = () => {
          const fileButton = document.getElementById(id);
          const file = fileButton ? fileButton.files[0] : null;
          if (props.onSelect) {
              let formData = new FormData();
              formData.append('avatar', file)
              props.onSelect(formData);
          }
      };
        return (
            <div>
                <Button
                    {...props}
                    as="label"
                    htmlFor={id}>
                    Change
                </Button>
                <input
                    hidden
                    id={id}
                    multiple
                    type="file"
                    onChange={onChangeFile} />
            </div>
        );
}

export default FileButton;
