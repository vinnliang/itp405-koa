const Koa = require('koa');
const Router = require('koa-router');
const Genre = require('./models/genre');
const Track = require('./models/track');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());



router.del('/api/tracks/:id', async (context) =>
{
  let id = context.params.id;
  let track = new Track({ TrackId: id });
	track = await track.fetch();

	try
  {
  		if (!track)
      {
  			   throw new Error(`${id} does not exist. Please enter a valid ID`);
  		}
  		await track.destroy();
  		context.body = 'Track deleted';
	} catch (e)
  {
  		context.status = 422;
  		context.body =
      {
  			   error: e.message
  		};
	}
});





router.get('/api/genres', async function(context)
{
  let genres = await Genre.fetchAll();
  context.body = genres;
});

router.get('/api/genres/:id', async (context) =>
{
  let id = context.params.id;
  let genre = new Genre({ GenreId: id });
  genre = await genre.fetch();

  if (!genre)
  {
    context.status = 404;
    context.body =
    {
        error: `Genre ${id} cannot be found`
    };
  } else
  {
    context.body = genre;
  }
});

router.post('/api/genres', async (context) =>
{
  //verify that Name isnt blank
    let name = context.request.body.name;

    try {
      if (!name) {
        throw new Error('A genre must have a name');
      }
      let genre = new Genre({ Name:name });
      genreWasFound = await genre.fetch();
      if (genreWasFound) {
        throw new Error(`Genre ${name} already exists`);
      }
      await genre.save();
      context.body = genre;
    } catch (e) {
      context.status = 422;
      context.body = {
        error: e.message
      };
    }
});

const port = (process.env.PORT || 3000);
app.use(router.routes());
app.listen(port, () => {
  console.log('Incoming Transmission. We are live on Port:' + port);
});
