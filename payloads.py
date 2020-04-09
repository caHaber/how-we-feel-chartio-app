
# Make a new name for the dashboard which will be the url slug used
# Then - in the embed page for the dashboard copy here the "Example Payload" and make whatever adjustments you'd like
# You will then be able to visit it at http://chartio-embed-proxy.herokuapp.com/your-slug
# Note - don't add exp here - it will be added at runtime

PAYLOADS = {
    "/the-how-we-feel-project/state-dashboard/":
    {
      "iat": 1586394190,
        "organization": 50756,
        "dashboard": 432097,
        "env": { 
            "STATE": "CT"
        }
    },

}
