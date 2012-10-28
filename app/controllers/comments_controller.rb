class CommentsController < ApplicationController
  before_filter :authorize, only: [:edit, :update, :delete]

  expose(:post)
  expose(:comments, ancestor: :post)
  expose(:comment)

  def create
    unless comment.save
      flash[:notice] = "Error creating comment." 
    end
    redirect_to post
  end
end
