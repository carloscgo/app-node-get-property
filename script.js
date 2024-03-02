import fetch from 'node-fetch';

// Extracting the property ID from the command-line arguments.
const propertyId = process.argv[2];

if (!propertyId) {
    console.error('Please provide a property ID.');
    process.exit(1);
}

const graphqlQuery = {
    query: `
        query propertyDetails($id: ID!) {
            property(id:$id) {
                id
                active
                country {
                    name
                }
                estate {
                    name
                }
                address
                description
                price_amount_usd
            }
        }`,
    variables: { id: propertyId },
};

const formatPrice = new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU'
  });
  
// Asynchronous function to perform the GraphQL request.
async function fetchPropertyDetails() {
    try {
        const response = await fetch('https://graph.infocasas.com.uy/graphql', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Origin': 'www.infocasas.com.uy',
                'X-Cookiepot': 3,
            },
            body: JSON.stringify(graphqlQuery),
        });
        
        // Check if the response is successful.
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const {data: { property }} = (await response.json());

        console.log(formatPrice.format(property.price_amount_usd));
    } catch (error) {
        console.error(`Price not found for id ${propertyId}`);
    }
}

// Run the GraphQL request function.
fetchPropertyDetails();
