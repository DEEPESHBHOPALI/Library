This is a Library project which helps to calculate the remaining charges whenever any use tries to return the books.

Start: Use "npm i" to install all the required dependencies.
Run : Use "npm start" to start the server.
Test : Use "npm test" to run the test cases.

Below are the required details/roadmap of the project.
----------------------------------------------------------

Initial Story: Develop an API that receives a book name and returns
the date when that book will be available.
The initial dataset is attached in the mail.
The expected requirement is to built the backend service exposing the
API required. You are expected to come up with the database schema and
load the data from the csv into the database as a build step.

Scenario Question:
You are the developer of the Store system and the below stories are in
your sprint. Develop the below features on top of your existing
solution as per previous round. Each story will be a git commit so
that we can verify the code per story. Please share the git repo link
after you're done

Story 1: The Store wants to bring in a feature to calculate the rent
charges per book. Per day rental charge is Rs 1 for all the books.
Create an API that will return the charges applicable when a customer
returns his/her lended books. The charges should be only for the
returned books only.

Story 2: The Store wants to change the charges on the books depending
on the types of the book. There are 3 kinds : Regular, Fiction and
Novel. Regular books renting per day charge is Rs. 1.5. For fiction
book renting per day charge is Rs. 3. For novels the per day charge is
Rs. 1.5.
Make sure to have a migration script that will update the type of the
book according to the author. It is upto you to assign the type.

Story 3: The store decided to alter the calculations for Regular books
and novels. Now for Regular books the first 2 days charges will be Rs
1 per day and 1.5 Rs there after. Minimum changes will be considered
as Rs 2 if days rented is less than 2 days. Similarly for Novel
minimum charges are introduced as 4.5 Rs if days rented is less than 3
days.
