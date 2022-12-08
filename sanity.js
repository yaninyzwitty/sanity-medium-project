import {createClient, createClientUserHook } from 'next-sanity'
import createImageUrlBuilder from '@sanity/image-url'
import {suspend} from 'suspend-react'
import {_checkAuth} from '@sanity/preview-kit'

export const config = {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // "pv8y60vp"
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', // "production"
        apiVersion: "2021-03-25",
        useCdn: process.env.NODE_ENV === 'production',
}
export const useCheckAuth = () => 
  suspend(() => _checkAuth(projectId, null), ['@sanity/preview-kit', 'checkAuth', projectId])

export const sanityClient = createClient(config)

export const urlFor = (source) => createImageUrlBuilder(config).image(source)