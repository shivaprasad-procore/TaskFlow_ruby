Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  
  # Health check endpoint
  get '/health', to: 'application#health'

  # API routes
  scope '/api' do
    # Task routes
    resources :tasks do
      # Nested comment routes for tasks
      resources :comments, only: [:index, :create]
    end
    
    # Comment routes (for update and delete)
    resources :comments, only: [:show, :update, :destroy]
  end
end
