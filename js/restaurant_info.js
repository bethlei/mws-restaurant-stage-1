let restaurant
let map

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error)
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      })
      fillBreadcrumb()
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map)
    }
  })
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return
  }
  const id = getParameterByName('id')
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null)
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant
      if (!restaurant) {
        console.error(error)
        return
      }
      fillRestaurantHTML()
      callback(null, restaurant)
    })
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name')
  const fave = `Click to Fave ${restaurant.name}`
  const unfave = `Click to Unfave ${restaurant.name}`
  const favoriteState = restaurant.is_favorite
  let isFavorite = (favoriteState && favoriteState === 'true' ? true : false)
  name.innerHTML = restaurant.name
  name.setAttribute('role', "button")
  name.setAttribute('aria-label', 'Click or unclick favorite icon')
  if (favoriteState === "true") {
    name.className = 'fave'
    name.setAttribute('title', unfave)
  } else {
    name.className = 'unfave'
    name.setAttribute('title', fave)
  }
  name.onclick = event => {
    if (name.classList.contains('unfave')) {
      name.classList.remove('unfave')
      name.classList.add('fave')
      name.setAttribute('title', unfave)
      isFavorite = false
    } else if (name.classList.contains('fave')) {
      name.classList.remove('fave')
      name.classList.add('unfave')
      name.setAttribute('title', fave)
      isFavorite = true
    }
    DBHelper.updateRestaurantFavoriteById(restaurant.id, isFavorite)
  }

  const addReviewBtn = document.getElementById('add-review')
  const submitReviewBtn = document.getElementById('submit-review')
  const cancelReviewBtn = document.getElementById('cancel-review')
  const reviewDialog = document.getElementById('review-dialog')
  addReviewBtn.onclick = () => {
    reviewDialog.showModal()
  }
  cancelReviewBtn.onclick = () => {
    reviewDialog.close()
  }
  submitReviewBtn.onclick = event => {
    const name = document.getElementById('review-username').value
    const rating = document.getElementById('review-rating').value
    const comments = document.getElementById('review-comment').value
    const emptyField = []

    if (name.trim() === '') {
      emptyField.push('name')
    }

    if (rating.trim() === '') {
      emptyField.push('rating')
    }

    if (comments.trim() === '') {
      emptyField.push('comments')
    }

    if (emptyField.length === 0) {
      DBHelper.addReview({
        restaurant_id: restaurant.id,
        name: name,
        rating: rating,
        comments: comments,
        createdAt: Date.now()
      })
      reviewDialog.close()
      document.getElementById('add-review-restaurant').reset()
    } else {
      // use html5 form validation to prevent submitting a review when there is a field that's not filled out.
      console.log('Prevent form submission when one of the form fields is empty')
    }
  }

  const ratingSelect = document.getElementById('review-rating')
  ratingSelect.onchange = event => {
    let elem = event.target
    if (elem && elem.matches(".form-element")) {
      elem.classList[elem.value ? "add" : "remove"]("-hasvalue");
    }
  }

  const address = document.getElementById('restaurant-address')
  address.innerHTML = restaurant.address

  const image = document.getElementById('restaurant-img')
  image.className = 'restaurant-img'
  const imageUrlBase = DBHelper.imageUrlForRestaurant(restaurant, 'banners')
  const imageUrl1x = imageUrlBase + `_1x.jpg`
  const imageUrl2x = imageUrlBase + `_2x.jpg`
  image.src = imageUrl1x
  image.srcset = `${imageUrl1x} 500w, ${imageUrl2x} 800w`
  image.alt = restaurant.name + ` restaurant banner image`

  const cuisine = document.getElementById('restaurant-cuisine')
  cuisine.innerHTML = restaurant.cuisine_type + ' Cuisine'

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML()
  }
  // fill reviews
  DBHelper.fetchRestaurantReviewsById(restaurant.id, fillReviewsHTML)
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours')
  for (let key in operatingHours) {
    const row = document.createElement('div')
    row.className = 'dow'

    const day = document.createElement('div')
    day.innerHTML = key
    row.appendChild(day)

    const time = document.createElement('div')
    time.innerHTML = operatingHours[key]
    row.appendChild(time)

    hours.appendChild(row)
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (error, reviews) => {
  const container = document.getElementById('reviews-container')
  if (!reviews) {
    const noReviews = document.createElement('p')
    noReviews.innerHTML = 'No reviews yet!'
    container.appendChild(noReviews)
    return
  }
  const ul = document.getElementById('reviews-list')
  if (ul.innerHTML !== '') {
    ul.innerHTML = ''
  }
  reviews.sort(function(a,b) { 
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() 
  }).forEach(review => {
    ul.appendChild(createReviewHTML(review))
  })
  container.appendChild(ul)
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li')

  const div = document.createElement('div')
  div.className = 'rewiew-header'

  const name = document.createElement('div')
  name.innerHTML = review.name
  name.className = 'name'
  name.setAttribute('aria-label', `Reviewer's name`)
  div.appendChild(name)

  const date = document.createElement('div')
  date.innerHTML = new Date(review.createdAt).toLocaleString('en-US', {year: 'numeric', month:'long', day: 'numeric'})
  date.setAttribute('aria-label', `Review date`)
  div.appendChild(date)

  li.appendChild(div)

  const rating = document.createElement('p')
  rating.innerHTML = `Rating: ${review.rating}`
  rating.className = 'rating'
  rating.setAttribute('aria-label', `Rating`)
  li.appendChild(rating)

  const comments = document.createElement('p')
  comments.innerHTML = review.comments
  comments.setAttribute('aria-label', `Review comments`)
  li.appendChild(comments)

  return li
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb')
  const li = document.createElement('li')
  li.innerHTML = restaurant.name
  li.setAttribute('aria-current', `page`)
  breadcrumb.appendChild(li)
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url)
  if (!results)
    return null
  if (!results[2])
    return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
