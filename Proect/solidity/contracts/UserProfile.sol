// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserProfile {
    struct Profile {
        string name;
        string phone;
        string email;
        string[] languages;
        string[] programmingLanguages;
        string bio;
    }

    mapping(address => Profile) private profiles;

    event ProfileUpdated(address indexed user, string name, string email);

    // Setează sau actualizează profilul unui utilizator
    function updateProfile(
        string memory _name,
        string memory _phone,
        string memory _email,
        string[] memory _languages,
        string[] memory _programmingLanguages,
        string memory _bio
    ) public {
        profiles[msg.sender] = Profile({
            name: _name,
            phone: _phone,
            email: _email,
            languages: _languages,
            programmingLanguages: _programmingLanguages,
            bio: _bio
        });

        emit ProfileUpdated(msg.sender, _name, _email);
    }

    // Obține profilul unui utilizator după adresa sa
    function getProfile(address _user) public view returns (Profile memory) {
        return profiles[_user];
    }
}
