import { Router } from 'express'
import { errorWrap } from '../utils'
import * as subscriptionController from '../controllers/subscription'

const router = Router()

router.post('/', errorWrap(subscriptionController.subscribe))
router.get('/', errorWrap(subscriptionController.getSubscriptions))
router.delete('/:subscriptionId', errorWrap(subscriptionController.deleteSubscription))
router.get('/blogs/my-list', errorWrap(subscriptionController.getMyBlogList))
router.get('/posts/my-list', errorWrap(subscriptionController.getPostsFromMyList))

export default router
