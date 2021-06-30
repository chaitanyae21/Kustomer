const initializationRequest = dataArr => {
  let request_json = {
    user_id: dataArr[3].id,
    useremail: dataArr[3].attributes.email,
    username: dataArr[3].attributes.name,
    company_orginal_id: dataArr[2].id,
    companyname: dataArr[2].attributes.name,
    source: "Kustomer"
  };

  fetch("https://api.csat.ai/csatai/initialization", {
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

const evaluationResponse = res => {};

Kustomer.initialize(conversation => {
  console.log(conversation);
  var attributes = conversation.attributes;
  console.log(attributes);
  var customerUrl = conversation.relationships.customer.links.self;
  var messagesUrl = conversation.relationships.messages.links.self;
  var orgUrl = conversation.relationships.org.links.self;
  var userUrl = conversation.relationships.modifiedBy.links.self;

  let contextData = getContext(customerUrl, messagesUrl, orgUrl, userUrl);
  // Kustomer.on("kustomer.message.create", function(context) {
  //   console.log(context);
  // });
  // Kustomer.on("kustomer.message.update", function(context) {
  //   console.log(context);
  // });
  // Kustomer.on("kustomer.conversation.update", function(context) {
  //   console.log(context);
  // });
  Kustomer.on("context", function(context) {
    let eval_obj = {
      current_answer: context.attributes.preview,
      status: context.attributes.status,
      timestamp: context.attributes.updatedAt,
      direction: context.attributes.direction,
      endedAt:
        context.attributes.status == "done" ? context.attributes.endedAt : "",
      endedByType:
        context.attributes.status == "done"
          ? context.attributes.endedByType
          : "",
      addInfo: context.attributes.lastDone
    };
    fetch("https://api.csat.ai/csatai/evaluation/v1", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(eval_obj),
      keepalive: true
    })
      .then(res => evaluationResponse(res))
      .catch(err => console.trace(err));
    [...document.querySelector("#star-wow_experience").children].forEach(star =>
      star.classList.replace("fal", "fas")
    );
    document.querySelector("#star-wow_experience").style.color = "#4f2c78";

    console.log(context);
  });
});

async function getContext(customerUrl, messagesUrl, orgUrl, userUrl) {
  let customerData, messagesData, orgData, userData;

  let CustomerDetails = () =>
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

  let MessageDetails = () =>
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

  let OrgDetails = () =>
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

  let UserDetails = () =>
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

  let customers = await CustomerDetails();
  let messages = await MessageDetails();
  let org = await OrgDetails();
  let user = await UserDetails();
  await initializationRequest([customerData, messagesData, orgData, userData]);

  // Promise.all([CustomerDetails, MessageDetails, OrgDetails, UserDetails])
  //   .then(details => {
  //     console.log(details);
  //     return details;
  //     // return [customerData, messagesData, orgData, userData];
  //   })
  //   .catch(err => console.trace(err));
}
