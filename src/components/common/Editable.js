import React, {useState, useCallback} from 'react';
import {
  Button,
  InlineError,
  Loading,
  Spinner,
  TextField,
  TextStyle,
} from '@shopify/polaris';
import { Mutation } from '@apollo/react-components';
import { findErrorMessage } from '../../lib';

export default function Editable(props) {

  const {id, fieldName, title, context, mutation, update, textStyle, type} = props;

  let fieldType = 'text';
  if (type) fieldType = type;

  const [value, setValue] = useState(title);
  const handleValue = useCallback((value) => setValue(value), []);

  const [editing, setEditing] = useState(false);

  return (
    <Mutation
      context={context}
      mutation={mutation}
      update={update}
    >
      {(handleTitleChange, { loading, error }) => {
        if (loading) { 
          return (
            <React.Fragment>
              <Loading />
              <Spinner size='small' />
            </React.Fragment>
          );
        }

        const isError = error && (
          <InlineError message={ findErrorMessage(error) }  />
        );

        const handleKeyPress = (event) => {
          const enterKeyPressed = event.keyCode === 13;
          if (enterKeyPressed) {
            event.preventDefault();
            const input = { id };
            input[fieldName] = value;
            handleTitleChange({ variables: { input } })
              .then(() => setEditing(false));
          }
        }

        return (
          editing ?
            <div
              onKeyDown={handleKeyPress}
            >
              <TextField
                focused
                clearButton
                value={value}
                type={fieldType}
                onChange={handleValue}
                onClearButtonClick={() => setEditing(false)}
              />
            </div>
            :
            <div
              onClick={() => setEditing(true)}
            >
              { textStyle === "button" ?
                <Button
                  primary
                >{ value }</Button>
                  :
                <TextStyle variation={textStyle}>{ value }</TextStyle>
              }
            { isError && isError } 
          </div>
        );
      }}
    </Mutation>
  )
}
