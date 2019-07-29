import React, {useState}  from 'react'

import {
 // TextInput,
 MaskedInput,
 Button,
} from 'grommet'

const getStatus = async (lisence) => {
 const uri = "https://vehicule-checker-api.herokuapp.com/api/v1/car/status?license=" + lisence;

 const response = await fetch(uri)

 console.log(response)
}

export default function CheckerForm() {
  const [value, setValue] = useState("");

  const onChange = event => {
        setValue(event.target.value);
  };

  const submit = () => {
    return getStatus(value)
  }

  return (
  <>
    <MaskedInput
              mask={[
                {
                  regexp: /^\d+$/,
                  placeholder: "5008"
                },
                { fixed: "-" },
                {
                  placeholder: "A"
                },
                { fixed: "-" },
                {
                  placeholder: "23"
                }
              ]}
              value={value}
              onChange={onChange}
              size= "medium"

            />

     <Button 
       label="Check"
       onClick={submit} 
       />
  </>
  );
}
