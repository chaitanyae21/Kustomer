const initializationRequest = dataArr => {
  let request_json = {
    user_id: dataArr[3].id,
    useremail: dataArr[3].attributes.email,
    username: dataArr[3].attributes.name,
    company_orginal_id: dataArr[2].id,
    companyname: dataArr[2].attributes.name,
    source: "Kustomer"
  };

  fetch("http://104.154.194.160:80/csatai/initialization", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(request_json),
    keepalive: true
  })
    .then(res => initializationResponse(res))
    .catch(err => console.trace(err));
};

const initializationResponse = () => {};

Kustomer.initialize(conversation => {
  console.log(conversation);
  var attributes = conversation.attributes;
  console.log(attributes);
  var customerUrl = conversation.relationships.customer.links.self;
  var messagesUrl = conversation.relationships.messages.links.self;
  var orgUrl = conversation.relationships.org.links.self;
  var userUrl = conversation.relationships.modifiedBy.links.self;

  let contextData = getContext(customerUrl, messagesUrl, orgUrl, userUrl);
  initializationRequest(contextData);

  // let customers = await CustomerDetails();
  // let messages =  await MessageDetails();
  // let org = await OrgDetails();
  // let user = await UserDetails();

  //   Promise.all(
  //     [CustomerDetails, MessageDetails, OrgDetails, UserDetails]).then(details => {
  //       console.log(details);
  //       let dataObj = {};
  //

  // }).catch((err)=>console.trace(err))

  function getContext(customerUrl, messagesUrl, orgUrl, userUrl) {
    let customerData, messagesData, orgData, userData;
    Kustomer.request(
      {
        url: customerUrl,
        method: "get"
      },
      function(err, customer) {
        if (err || !customer) {
          console.log(err);
        } else {
          customerData = customer;
          console.log(customer);
        }
      }
    );

    Kustomer.request(
      {
        url: messagesUrl,
        method: "get"
      },
      function(err, messages) {
        if (err || !messages) {
          console.log(err);
        } else {
          messagesData = messages;
          console.log(messages);
        }
      }
    );

    Kustomer.request(
      {
        url: orgUrl,
        method: "get"
      },
      function(err, org) {
        if (err || !org) {
          console.log(err);
        } else {
          orgData = org;
          console.log(org);
        }
      }
    );

    Kustomer.request(
      {
        url: userUrl,
        method: "get"
      },
      function(err, user) {
        if (err || !user) {
          console.log(err);
        } else {
          userData = user;
          console.log(user);
        }
      }
    );

    return [customerData, messagesData, orgData, userData];
  }
});
