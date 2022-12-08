export default {
    name: 'comment',
    type: 'document',
    title: 'Comment',
    fields: [
      {
        name: 'name',
        type: 'string',
      },
      {
          title: 'Approved',
          name: 'approved',
        type: 'boolean',
        description: 'Comment wont show on the site with Approval'
  
      },
      {
        name: 'email',
        type: 'string',
      },
      {
        name: 'comment',
        type: 'string',
     
      },
      {
        name: 'post',
        type: 'reference',
        to: [{ type: 'post' }],
        
        
      },

    ],
  
   
  }
  