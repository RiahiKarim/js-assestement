# JS Assessment

## Requirement

**Example**

Input:

```
1 08:45-12:59
3 11:09-11:28
5 09:26-09:56
5 16:15-16:34
3 08:40-10:12
```

Output:

```
1 13:00-13:59
```


### Environnement

Node.js v12.18.4

### Tests

Run all tests:

```
npm run test
```

Run watch mode:
```
npm run test:watch
```

## Code review

1. 

```js
const data = [
   { value: "1", label: "One" },
   { value: "2", label: "Two" },
   { value: "3", label: "Three" },
];

function getValues() {
   return data.reduce((acc, { value, label }) => {
      acc.push(value);
      return acc;
   }, []);
}
```
*Code review:*
 - The destructed `label` property is not used. Could you remove it please.

```js
const data = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
  { value: '3', label: 'Three' },
];

function getValues() {
  return data.reduce((acc, { value }) => {
    acc.push(value);
    return acc;
  }, []);
}
```

2. 

```js
async function getIndexes() {
   return await fetch('https://api.coingecko.com/api/v3/indexes').then(res => res.json());
}

async function analyzeIndexes() {
   const indexes = await getIndexes().catch((_) => {
      throw new Error('Unable to fetch indexes')
   });
   return indexes;
}
```

*Code review:*
 - The `return await` in the `getIndexes` function has no benefit. it's redundant because the `analyzeIndexes` function will also await it, so there is no reason to not just send the Promise along and let `analyzeIndexes` function deal with it.
 - You could also use a `try/catch` in the `analyzeIndexes` function to catch the error and deal with. 

```js
function getIndexes() {
  return fetch('https://api.coingecko.com/api/v3/indexes').then(res => res.json());
}

async function analyzeIndexes() {
  try {
    const indexes = await getIndexes();
    return indexes;
  } catch (err) {
    throw new Error('Unable to fetch indexes');
  }
}
```

3. 

```js
let state;
const user = await getUser();
if (user) {
   const project = await getProject(user.id);
   user.project = project;
   state = user;
} else {
   state = {
      project: null
   };
}
ctx.body = state;
```

*Code review:*
 - You should avoid mutating the original objects. You can use the spread operator to copy a provided object onto a new object.

```js
let state;
const user = await getUser();
if (user) {
    const project = await getProject(user.id);
    state = {
        user: {
            ...user,
            project,
        }
    };
} else {
    state = {
        user: null,
    };
}
ctx.body = state;
```


4. 

```js
function getQueryProvider() {
  const url = window.location.href;
  const [_, provider] = url.match(/provider=([^&]*)/);
  if (provider) {
     return provider;
  }
  return;
}
```
*Code review:*
 - The [String.match()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) method returns `null` if no matches are found. Your function will not work properly if there is no match because `null` cannot be destructed (not an iterable). 
 - You can also remove the `return;` from the function.

```js
function getQueryProvider() {
  const url = window.location.href;
  const found = url.match(/provider=([^&]*)/);
  const provider = found && found[1];
  if (provider) {
     return provider;
  }
}
```

5. 

```js
function getParagraphTexts() {
   const texts = [];
   document.querySelectorAll("p").forEach(p => {
      texts.push(p);
   });
   return texts;
}
```
*Code review:*
 - You don't need to loop through the `document.querySelectorAll("p")` to get the texts.

```js
function getParagraphTexts() {
  return document.querySelectorAll('p');
}
```

6. 

```js
function Employee({ id }) {
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(true);
   const [employee, setEmployee] = useState({});

   useEffect(() => {
      getEmployee(id)
         .then(employee => {
            setEmployee(employee);
            setLoading(false);
         })
         .catch((e) => {
            setError('Unable to fetch employee');
            setLoading(false);
         });
   }, [id]);

   if (error) {
      return <Error />;
   }

   if (loading) {
      return <Loading />;
   }

   return (
      <Table>
         <Row>
            <Cell>{employee.firstName}</Cell>
            <Cell>{employee.lastName}</Cell>
            <Cell>{employee.position}</Cell>
            <Cell>{employee.project}</Cell>
            <Cell>{employee.salary}</Cell>
            <Cell>{employee.yearHired}</Cell>
            <Cell>{employee.wololo}</Cell>
         </Row>
      </Table>
   );
}
```
*Code review:*
 - The `loading` initial state should be set to `false`.
 - I suggest creating an async `fetchData` function to take advantage of the `async/await` syntax. 

```js
function Employee({ id }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [employee, setEmployee] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const emp = getEmployee(id);
                setEmployee(emp);
            } catch (err) {
                setError('Unable to fetch employee');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <Error />;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <Table>
            <Row>
                <Cell>{employee.firstName}</Cell>
                <Cell>{employee.lastName}</Cell>
                <Cell>{employee.position}</Cell>
                <Cell>{employee.project}</Cell>
                <Cell>{employee.salary}</Cell>
                <Cell>{employee.yearHired}</Cell>
                <Cell>{employee.wololo}</Cell>
            </Row>
        </Table>
    );
}
```

7. 

```js
async function getFilledIndexes() {
   try {
      const filledIndexes = [];
      const indexes = await getIndexes();
      const status = await getStatus();
      const usersId = await getUsersId();
      
      for (let index of indexes) {
         if (index.status === status.filled && users.includes(index.userId)) {
            filledIndexes.push(index);
         }
      }
      return filledIndexes;
   } catch(_) {
      throw new Error ('Unable to get indexes');
   }
}
```
*Code review:*
 - Renaming `filledIndexes` to `filledUserIndexes` would be more explicit.
 - To filter indexes you can use `Array.filter()` method.
 - I believe that `index.userId === usersId` would be the correct way to filter user's indexes.
 
```js
async function getFilledIndexes() {
  try {
    const indexes = await getIndexes();
    const status = await getStatus();
    const usersId = await getUsersId();

    const filledUserIndexes = indexes.filter(
      (index) => index.status === status.filled && index.userId === usersId,
    );

    return filledUserIndexes;
  } catch (_) {
    throw new Error('Unable to get indexes');
  }
}
```

8. 

```js
function getSettings(user) {
   if (user) {
      const project = getProject(user.id);
      if (project) {
         const settings = getSettings(project.id);
         if (settings) {
            return settings;
         }
      }
   }
   return {};
}
```

*Code review:*
 - You can use inverted-ifs to avoid nested if statements and improve the code readability.

```js
function getSettings(user) {
  if (!user) {
    return {};
  }

  const project = getProject(user.id);
  if (!project) {
    return {};
  }

  const settings = getSettings(project.id);
  if (!settings) {
    return {};
  }

  return settings;
}
```