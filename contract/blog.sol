// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

contract Blog {

    uint internal postCount = 0;

    // Structure of a blog post.
    struct Post {
        string author;
        string title;
        string content;
    }

    // Each post will have a unique integer identifier.
    mapping (uint => Post) internal posts;

    function createPost(string memory _author, string memory _title, string memory _content) public {
        posts[postCount] = Post(_author,_title,_content);
        postCount ++;
    }

    function displayPost(uint _index) public view returns (string memory, string memory, string memory){
        return (posts[_index].author, posts[_index].title, posts[_index].content);
    }

    function getPostCount() public view returns(uint){
        return postCount;
    }



}